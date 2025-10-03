'use client'

import ChatList from '@/components/chat/chatList'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import styles from '@/styles/Chat.module.css'
import { useChatContext } from '@/contexts/ChatContext'

export default function ChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { refreshChats } = useChatContext()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.replace('/auth/signin')
      return
    }
    // ensure chats are loaded as early as possible
    refreshChats()
  }, [session, status, router, refreshChats])

  // Render nothing until redirect decision is made to avoid flicker
  if (status === 'loading') {
    return 'Loading...'
  }

  return (
    <div className={styles.chatLayout}>
      {/* Chat List Sidebar */}
      <div className={styles.chatSidebar}>
        <ChatList />
      </div>

      {/* Chat Area */}
      <div className={styles.chatArea}>
        <div className={styles.messagesArea}>
          <div className={styles.emptyState}>
            <h2 className={styles.emptyStateTitle}>Select a chat</h2>
            <p className={styles.emptyStateText}>
              Choose a conversation from the list
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
