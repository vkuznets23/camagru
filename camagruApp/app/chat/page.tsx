'use client'

import ChatList from '@/components/chat/chatList'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import styles from '@/styles/Chat.module.css'

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
    <div className={styles.chatLayout}>
      {/* Chat List Sidebar */}
      <div className={styles.chatSidebar}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.sidebarTitle}>💬 Messages</h1>
        </div>
        <ChatList />
      </div>

      {/* Chat Area */}
      <div className={styles.chatArea}>
        <div className={styles.messagesArea}>
          <div className={styles.emptyState}>
            <h2 className={styles.emptyStateTitle}>Select a chat</h2>
            <p className={styles.emptyStateText}>
              Choose a conversation from the sidebar to start messaging
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
