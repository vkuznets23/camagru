import { useState, useEffect, useCallback } from 'react'
import { useSocket } from './useSocket'
import { type Chat, type Message, type TypingUser } from '@/types/chat'
import {
  getChats,
  getChat,
  createDirectChat,
  getMessages,
  sendMessage as sendMessageApi,
} from '@/utils/chatApi'

export const useChat = () => {
  const { socket, isConnected } = useSocket()
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChat, setCurrentChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Загрузить все чаты
  const loadChats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getChats()
      setChats(response.chats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chats')
    } finally {
      setLoading(false)
    }
  }, [])

  // Загрузить конкретный чат
  const loadChat = useCallback(async (chatId: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await getChat(chatId)
      setCurrentChat(response.chat)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chat')
    } finally {
      setLoading(false)
    }
  }, [])

  // Создать или найти прямой чат
  const createOrFindDirectChat = useCallback(
    async (userId: string) => {
      try {
        setLoading(true)
        setError(null)
        const response = await createDirectChat({ userId })
        setCurrentChat(response.chat)

        // Обновляем список чатов
        await loadChats()

        return response.chat
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to create direct chat'
        )
        throw err
      } finally {
        setLoading(false)
      }
    },
    [loadChats]
  )

  // Загрузить сообщения чата
  const loadMessages = useCallback(async (chatId: string, page: number = 1) => {
    try {
      setLoading(true)
      setError(null)
      const response = await getMessages(chatId, page)

      if (page === 1) {
        setMessages(response.messages)
      } else {
        setMessages((prev) => [...response.messages, ...prev])
      }

      return response.hasMore
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // Отправить сообщение
  const sendMessage = useCallback(
    async (
      chatId: string,
      content: string,
      type: 'TEXT' | 'IMAGE' = 'TEXT',
      imageUrl?: string
    ) => {
      try {
        setError(null)
        const response = await sendMessageApi(chatId, {
          content,
          type,
          imageUrl,
        })

        // Добавляем сообщение в локальное состояние
        setMessages((prev) => [...prev, response.message])

        // Отправляем через WebSocket
        if (socket && isConnected) {
          socket.emit('send-message', {
            chatId,
            message: content,
            senderId: response.message.sender.id,
            senderName:
              response.message.sender.name || response.message.sender.username,
            timestamp: new Date(response.message.createdAt).getTime(),
          })
        }

        return response.message
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to send message')
        throw err
      }
    },
    [socket, isConnected]
  )

  // Отправить уведомление о наборе текста
  const sendTyping = useCallback(
    (chatId: string, userId: string, isTyping: boolean) => {
      if (socket && isConnected) {
        socket.emit('typing', { chatId, userId, isTyping })
      }
    },
    [socket, isConnected]
  )

  // WebSocket обработчики
  useEffect(() => {
    if (!socket || !isConnected) return

    // Новое сообщение
    const handleNewMessage = (message: Message) => {
      setMessages((prev) => {
        // Проверяем, что сообщение еще не добавлено
        if (prev.some((m) => m.id === message.id)) {
          return prev
        }
        return [...prev, message]
      })
    }

    // Пользователь печатает
    const handleUserTyping = (data: { userId: string; isTyping: boolean }) => {
      setTypingUsers((prev) => {
        if (data.isTyping) {
          return prev.some((u) => u.userId === data.userId)
            ? prev
            : [...prev, { userId: data.userId, isTyping: true }]
        } else {
          return prev.filter((u) => u.userId !== data.userId)
        }
      })
    }

    // Статус пользователя
    const handleUserStatus = (data: {
      userId: string
      status: 'online' | 'offline'
    }) => {
      setChats((prev) =>
        prev.map((chat) => ({
          ...chat,
          participants: chat.participants.map((p) =>
            p.user.id === data.userId
              ? {
                  ...p,
                  user: { ...p.user, isOnline: data.status === 'online' },
                }
              : p
          ),
        }))
      )
    }

    socket.on('new-message', handleNewMessage)
    socket.on('user-typing', handleUserTyping)
    socket.on('user-status', handleUserStatus)

    return () => {
      socket.off('new-message', handleNewMessage)
      socket.off('user-typing', handleUserTyping)
      socket.off('user-status', handleUserStatus)
    }
  }, [socket, isConnected])

  // Очистка состояния при смене чата
  const clearCurrentChat = useCallback(() => {
    setCurrentChat(null)
    setMessages([])
    setTypingUsers([])
  }, [])

  return {
    // Состояние
    chats,
    currentChat,
    messages,
    typingUsers,
    loading,
    error,
    isConnected,

    // Действия
    loadChats,
    loadChat,
    createOrFindDirectChat,
    loadMessages,
    sendMessage,
    sendTyping,
    clearCurrentChat,

    // Утилиты
    setError,
  }
}

export default useChat
