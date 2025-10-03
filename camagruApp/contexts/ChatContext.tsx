'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { useUnreadCount } from './UnreadCountContext'

interface Chat {
  id: string
  name: string
  image: string | null
  lastMessage: LastMessage | string | null
  participants: Participant[]
  unreadCount?: number
}

interface Participant {
  id: string
  name: string
  image: string
}

interface LastMessage {
  id?: string
  content?: string
  text?: string
  createdAt?: string
  sender?: {
    id: string
    name?: string | null
    username?: string | null
    image?: string | null
  }
}

interface ChatContextType {
  chats: Chat[]
  setChats: (chats: Chat[]) => void
  updateChatLastMessage: (chatId: string, message: LastMessage) => void
  refreshChats: () => Promise<void>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([])
  const { refreshUnreadCount } = useUnreadCount()

  const updateChatLastMessage = (chatId: string, message: LastMessage) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, lastMessage: message } : chat
      )
    )
    // Refresh unread count when a new message is sent
    refreshUnreadCount()
  }

  const refreshChats = async () => {
    try {
      const response = await fetch('/api/chats')
      const data = await response.json()
      const items: Chat[] = Array.isArray(data?.chats) ? data.chats : []
      setChats(items)
    } catch (error) {
      console.error('Error refreshing chats:', error)
    }
  }

  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
        updateChatLastMessage,
        refreshChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}
