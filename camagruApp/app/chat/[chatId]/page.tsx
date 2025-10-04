'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, use, useMemo, useCallback, useRef } from 'react'
import Image from 'next/image'
import ChatList from '@/components/chat/chatList'
import MessageBubble, { Message } from '@/components/chat/messageBubble'
import MessageInput from '@/components/chat/MessageInput'
import { useChatContext } from '@/contexts/ChatContext'
import { useUnreadCount } from '@/contexts/UnreadCountContext'
import { useChatSidebar } from '@/contexts/ChatSidebarContext'

import styles from '@/styles/Chat.module.css'

interface Chat {
  id: string
  name: string
  image?: string
  participants: Array<{
    id: string
    name: string
    image?: string
  }>
}

export default function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { updateChatLastMessage } = useChatContext()
  const { refreshUnreadCount } = useUnreadCount()
  const { isSidebarOpen, closeSidebar } = useChatSidebar()
  const [chat, setChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const { chatId } = use(params)

  // Memoize current user ID to prevent unnecessary re-renders
  const currentUserId = useMemo(() => session?.user?.id, [session?.user?.id])

  // Ref for messages container to scroll to bottom
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    // Fetch chat details and messages
    const fetchChat = async () => {
      try {
        const [chatResponse, messagesResponse] = await Promise.all([
          fetch(`/api/chats/${chatId}`),
          fetch(`/api/chats/${chatId}/messages`),
        ])

        if (chatResponse.ok) {
          const chatData = await chatResponse.json()
          setChat(chatData.chat)
        } else {
          router.push('/chat')
          return
        }

        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json()
          console.log('Messages data:', messagesData)
          setMessages(messagesData.messages || [])

          // Mark messages as read
          try {
            await fetch(`/api/chats/${chatId}/mark-read`, {
              method: 'POST',
            })
            // Refresh unread count after marking as read
            refreshUnreadCount()
          } catch (error) {
            console.error('Error marking messages as read:', error)
          }
        }
      } catch (error) {
        console.error('Error fetching chat:', error)
        router.push('/chat')
      } finally {
        setLoading(false)
      }
    }

    fetchChat()
  }, [session, status, router, chatId, refreshUnreadCount])

  const handleSendMessage = useCallback(
    async (message: string) => {
      if (!session?.user?.id || !chat) return

      setSending(true)
      try {
        const response = await fetch(`/api/chats/${chatId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: message,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const newMessage = data.message
          setMessages((prev) => [...prev, newMessage])

          // Update last message in chat list
          updateChatLastMessage(chatId, {
            id: newMessage.id,
            content: newMessage.content,
            createdAt: newMessage.createdAt,
            sender: newMessage.sender,
          })
        } else {
          console.error('Failed to send message')
        }
      } catch (error) {
        console.error('Error sending message:', error)
      } finally {
        setSending(false)
      }
    },
    [session?.user?.id, chat, chatId, updateChatLastMessage]
  )

  // Scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  if (status === 'loading' || loading) {
    return (
      <div
        style={{
          maxWidth: '935px',
          margin: '0 auto',
          padding: '20px',
          minHeight: '100vh',
          backgroundColor: 'var(--background)',
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Loading...
      </div>
    )
  }

  if (!session || !chat) {
    return null
  }

  return (
    <div className={styles.chatLayout}>
      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div className={styles.sidebarBackdrop} onClick={closeSidebar} />
      )}

      {/* Chat List Sidebar */}
      <div
        className={`${styles.chatSidebar} ${
          isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`}
      >
        <ChatList />
      </div>

      {/* Chat Area */}
      <div className={styles.chatArea}>
        {/* Chat Header - Mobile Only */}
        <div className={styles.chatHeaderMobile}>
          <div className={styles.chatHeaderInfo}>
            <Image
              src={chat.image || '/default_avatar.png'}
              alt={chat.name}
              width={32}
              height={32}
              className={styles.chatHeaderAvatar}
            />
            <h1 className={styles.chatHeaderTitle}>{chat.name}</h1>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className={styles.messagesArea}>
          {messages.length > 0 ? (
            <div className={styles.messagesList}>
              {messages.map((message, index) => (
                <MessageBubble
                  key={message.id || `message-${index}`}
                  message={message}
                  isOwn={message.senderId === currentUserId}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className={styles.emptyState}>
              <h2 className={styles.emptyStateTitle}>No messages yet</h2>
              <p className={styles.emptyStateText}>Start the conversation!</p>
            </div>
          )}
        </div>

        <div className={styles.messageInputContainer}>
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={sending}
            placeholder="Type a message..."
          />
        </div>
      </div>
    </div>
  )
}
