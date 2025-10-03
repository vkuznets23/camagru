'use client'

import ChatList from '@/components/chat/chatList'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import styles from '@/styles/Chat.module.css'
import { useChatContext } from '@/contexts/ChatContext'

export default function ChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { chats, refreshChats } = useChatContext()
  const didRedirectRef = useRef(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.replace('/auth/signin')
      return
    }
    // ensure chats are loaded as early as possible
    refreshChats()
  }, [session, status, router, refreshChats])

  // redirect to first chat when available
  useEffect(() => {
    if (!session || status !== 'authenticated') return
    if (didRedirectRef.current) return
    if (Array.isArray(chats) && chats.length > 0) {
      didRedirectRef.current = true
      router.replace(`/chat/${chats[0].id}`)
    }
  }, [chats, session, status, router])

  // Render nothing until redirect decision is made to avoid flicker
  if (status === 'loading' || !session || !didRedirectRef.current) {
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
        <div className={styles.messagesArea}></div>
      </div>
    </div>
  )
}
