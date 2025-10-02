'use client'

import ChatList from '@/components/chat/ChatList'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (!session) {
      router.push('/auth/signin')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return 'Loading...'
  }

  if (!session) {
    return null
  }

  return (
    <div
      style={{
        maxWidth: '935px',
        margin: '0 auto',
        padding: '20px',
        minHeight: '100vh',
        backgroundColor: 'var(--background)',
        color: 'var(--text-primary)',
      }}
    >
      <h1
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '20px',
          textAlign: 'center',
        }}
      >
        💬 Chat
      </h1>
      <ChatList />
    </div>
  )
}
