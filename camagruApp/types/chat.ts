export interface Message {
  id: string
  chatId: string
  senderId: string
  receiverId?: string
  content: string
  type: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM'
  imageUrl?: string
  isRead: boolean
  isEdited: boolean
  isDeleted: boolean
  replyToId?: string
  createdAt: string
  updatedAt: string
  sender: {
    id: string
    username: string
    name?: string
    image?: string
  }
  replyTo?: {
    id: string
    content: string
    sender: {
      id: string
      username: string
      name?: string
    }
  }
}

export interface Chat {
  id: string
  name: string
  image?: string
  createdAt: string
  updatedAt: string
  lastMessageAt?: string
  participants: ChatParticipant[]
  lastMessage?: Message
  unreadCount?: number
}

export interface ChatParticipant {
  id: string
  chatId: string
  userId: string
  joinedAt: string
  leftAt?: string
  isActive: boolean
  user: {
    id: string
    username: string
    name?: string
    image?: string
    isOnline: boolean
    lastSeen?: string
  }
}

export interface TypingUser {
  userId: string
  isTyping: boolean
}

export interface SocketEvents {
  // Исходящие события (клиент → сервер)
  'join-user-room': (userId: string) => void
  'join-chat': (chatId: string) => void
  'send-message': (data: {
    chatId: string
    message: string
    senderId: string
    senderName: string
    timestamp: number
  }) => void
  typing: (data: { chatId: string; userId: string; isTyping: boolean }) => void
  'user-online': (userId: string) => void

  // Входящие события (сервер → клиент)
  'new-message': (message: Message) => void
  'user-typing': (data: { userId: string; isTyping: boolean }) => void
  'user-status': (data: {
    userId: string
    status: 'online' | 'offline'
  }) => void
}
