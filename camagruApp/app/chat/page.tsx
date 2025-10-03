'use client'

import ChatList from '@/components/chat/chatList'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import styles from '@/styles/Chat.module.css'
import { useChatContext } from '@/contexts/ChatContext'
import { useChatSidebar } from '@/contexts/ChatSidebarContext'

export default function ChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { refreshChats } = useChatContext()
  const { isSidebarOpen, closeSidebar } = useChatSidebar()

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
