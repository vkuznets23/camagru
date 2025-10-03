export interface Message {
  id: string
  chatId: string
  senderId: string
  content: string
  createdAt: string
  sender: {
    id: string
    username: string
    name?: string
    image?: string
  }
}

export interface Chat {
  id: string
  name: string
  image?: string
  participants: ChatParticipant[]
  lastMessage?: Message
}

export interface ChatParticipant {
  id: string
  user: {
    id: string
    username: string
    name?: string
    image?: string
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

  // Входящие события (сервер → клиент)
  'new-message': (message: Message) => void
  'user-typing': (data: { userId: string; isTyping: boolean }) => void
}
