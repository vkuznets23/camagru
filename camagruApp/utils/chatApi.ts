import { type Chat, type Message } from '@/types/chat'

const API_BASE = '/api/chats'

export interface CreateChatRequest {
  type?: 'DIRECT' | 'GROUP'
  participantIds: string[]
  name?: string
  description?: string
}

export interface CreateDirectChatRequest {
  userId: string
}

export interface SendMessageRequest {
  content: string
  type?: 'TEXT' | 'IMAGE' | 'FILE'
  replyToId?: string
  imageUrl?: string
}

export interface ChatResponse {
  chat: Chat
}

export interface ChatsResponse {
  chats: Chat[]
}

export interface MessagesResponse {
  messages: Message[]
  hasMore: boolean
  page: number
}

export interface MessageResponse {
  message: Message
}

// Получить все чаты пользователя
export const getChats = async (): Promise<ChatsResponse> => {
  const response = await fetch(API_BASE)
  if (!response.ok) {
    throw new Error('Failed to fetch chats')
  }
  return response.json()
}

// Получить информацию о конкретном чате
export const getChat = async (chatId: string): Promise<ChatResponse> => {
  const response = await fetch(`${API_BASE}/${chatId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch chat')
  }
  return response.json()
}

// Создать новый чат
export const createChat = async (
  data: CreateChatRequest
): Promise<ChatResponse> => {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to create chat')
  }
  return response.json()
}

// Создать или найти прямой чат с пользователем
export const createDirectChat = async (
  data: CreateDirectChatRequest
): Promise<ChatResponse> => {
  const response = await fetch(`${API_BASE}/direct`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to create/find direct chat')
  }
  return response.json()
}

// Получить сообщения чата
export const getMessages = async (
  chatId: string,
  page: number = 1,
  limit: number = 50
): Promise<MessagesResponse> => {
  const response = await fetch(
    `${API_BASE}/${chatId}/messages?page=${page}&limit=${limit}`
  )
  if (!response.ok) {
    throw new Error('Failed to fetch messages')
  }
  return response.json()
}

// Отправить сообщение
export const sendMessage = async (
  chatId: string,
  data: SendMessageRequest
): Promise<MessageResponse> => {
  const response = await fetch(`${API_BASE}/${chatId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to send message')
  }
  return response.json()
}

// Обновить информацию о чате
export const updateChat = async (
  chatId: string,
  data: { name?: string; description?: string; image?: string }
): Promise<ChatResponse> => {
  const response = await fetch(`${API_BASE}/${chatId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to update chat')
  }
  return response.json()
}

// Покинуть чат
export const leaveChat = async (chatId: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/${chatId}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to leave chat')
  }
}
