'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react'
import { useSession } from 'next-auth/react'
import { useSocket } from '@/hooks/useSocket'

interface UnreadCountContextType {
  unreadCount: number
  refreshUnreadCount: () => Promise<void>
}

const UnreadCountContext = createContext<UnreadCountContextType | undefined>(
  undefined
)

export function UnreadCountProvider({ children }: { children: ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0)
  const { data: session } = useSession()
  const { socket } = useSocket()

  const refreshUnreadCount = useCallback(async () => {
    if (!session?.user?.id) {
      setUnreadCount(0)
      return
    }

    try {
      const response = await fetch('/api/chats/unread-count')
      if (response.ok) {
        const data = await response.json()
        setUnreadCount(data.count || 0)
      }
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }, [session?.user?.id])

  useEffect(() => {
    if (session?.user?.id) {
      refreshUnreadCount()
    }
  }, [session?.user?.id]) // Remove refreshUnreadCount from dependencies

  // Listen for new messages via WebSocket to update unread count
  useEffect(() => {
    if (!socket || !session?.user?.id) return

    const handleNewMessage = (data: { senderId: string; chatId: string }) => {
      // Don't update count for own messages
      if (data.senderId === session.user.id) return

      // Don't update count if user is currently viewing this chat
      const currentPath = window.location.pathname
      if (currentPath.includes(`/chat/${data.chatId}`)) return

      // Refresh unread count when a new message is received
      refreshUnreadCount()
    }

    socket.on('new-message', handleNewMessage)

    return () => {
      socket.off('new-message', handleNewMessage)
    }
  }, [socket, session?.user?.id]) // Remove refreshUnreadCount from dependencies

  // Refresh on visibility/focus change for instant badge updates
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshUnreadCount()
      }
    }
    window.addEventListener('focus', refreshUnreadCount)
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      window.removeEventListener('focus', refreshUnreadCount)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, []) // Remove refreshUnreadCount from dependencies

  return (
    <UnreadCountContext.Provider
      value={{
        unreadCount,
        refreshUnreadCount,
      }}
    >
      {children}
    </UnreadCountContext.Provider>
  )
}

export function useUnreadCount() {
  const context = useContext(UnreadCountContext)
  if (context === undefined) {
    throw new Error('useUnreadCount must be used within an UnreadCountProvider')
  }
  return context
}
