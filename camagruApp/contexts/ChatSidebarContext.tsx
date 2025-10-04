'use client'

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface ChatSidebarContextType {
  isSidebarOpen: boolean
  toggleSidebar: () => void
  closeSidebar: () => void
  openSidebar: () => void
  selectChat: (chatId: string) => void
}

const ChatSidebarContext = createContext<ChatSidebarContextType | undefined>(
  undefined
)

export function ChatSidebarProvider({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  const openSidebar = () => {
    setIsSidebarOpen(true)
  }

  const selectChat = (chatId: string) => {
    router.push(`/chat/${chatId}`)
    // Close sidebar on mobile/tablet when chat is selected (≤820px)
    if (window.innerWidth <= 820) {
      closeSidebar()
    }
  }

  // Manage sidebar visibility based on screen size and route
  useEffect(() => {
    const isOnSpecificChat =
      pathname && pathname.startsWith('/chat/') && pathname !== '/chat'
    const isOnChatIndex = pathname === '/chat'
    const isMobileOrTablet = window.innerWidth <= 820

    if (isMobileOrTablet) {
      // Mobile/tablet behavior
      if (isOnSpecificChat && isSidebarOpen) {
        closeSidebar()
      } else if (isOnChatIndex) {
        openSidebar()
      }
    } else {
      // Desktop behavior - always keep sidebar open on chat pages
      if (isOnChatIndex || isOnSpecificChat) {
        openSidebar()
      }
    }
  }, [pathname, isSidebarOpen, closeSidebar, openSidebar])

  return (
    <ChatSidebarContext.Provider
      value={{
        isSidebarOpen,
        toggleSidebar,
        closeSidebar,
        openSidebar,
        selectChat,
      }}
    >
      {children}
    </ChatSidebarContext.Provider>
  )
}

export function useChatSidebar() {
  const context = useContext(ChatSidebarContext)
  if (context === undefined) {
    throw new Error('useChatSidebar must be used within a ChatSidebarProvider')
  }
  return context
}
