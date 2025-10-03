'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, use } from 'react'
import ChatList from '@/components/chat/chatList'
import MessageBubble, { Message } from '@/components/chat/messageBubble'
import MessageInput from '@/components/chat/MessageInput'
import { useChatContext } from '@/contexts/ChatContext'
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
  const [chat, setChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const { chatId } = use(params)

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
        }
      } catch (error) {
        console.error('Error fetching chat:', error)
        router.push('/chat')
      } finally {
        setLoading(false)
      }
    }

    fetchChat()
  }, [session, status, router, chatId])

  const handleSendMessage = async (message: string) => {
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
  }

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
      {/* Chat List Sidebar */}
      <div className={styles.chatSidebar}>
        <ChatList />
      </div>

      {/* Chat Area */}
      <div className={styles.chatArea}>
        {/* Chat Messages Area */}
        <div className={styles.messagesArea}>
          {messages.length > 0 ? (
            <div className={styles.messagesList}>
              {messages.map((message, index) => (
                <MessageBubble
                  key={message.id || `message-${index}`}
                  message={message}
                  isOwn={message.senderId === session?.user?.id}
                />
              ))}
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
