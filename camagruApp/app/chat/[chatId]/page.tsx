'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, use } from 'react'
import ChatList from '@/components/chat/chatList'
import styles from '@/styles/Chat.module.css'

interface Chat {
  id: string
  name: string
  image?: string
  participants: Array<{
    id: string
    username: string
    name?: string
    image?: string
    isOnline: boolean
  }>
}

export default function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [chat, setChat] = useState<Chat | null>(null)
  const [loading, setLoading] = useState(true)
  const { chatId } = use(params)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    // Fetch chat details
    const fetchChat = async () => {
      try {
        const response = await fetch(`/api/chats/${chatId}`)
        if (response.ok) {
          const data = await response.json()
          setChat(data.chat)
        } else {
          router.push('/chat')
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
          <div className={styles.placeholderContent}>
            <p>Chat interface will be implemented here</p>
            <p>Chat ID: {chatId}</p>
            <p>
              Participants:{' '}
              {chat.participants.map((p) => p.username).join(', ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
