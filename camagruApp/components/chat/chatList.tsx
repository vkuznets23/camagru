import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import styles from '@/styles/Chat.module.css'

interface Chat {
  id: string
  name: string
  image: string | null
  lastMessage: LastMessage | string | null
  participants: Participant[]
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

export default function ChatList() {
  const [chats, setChats] = useState<Chat[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch('/api/chats')
        const data = await response.json()
        // API returns { chats: [...] }
        const items: Chat[] = Array.isArray(data?.chats) ? data.chats : []
        setChats(items)
        return items
      } catch (error) {
        console.error(error)
        return []
      }
    }
    fetchChats()
  }, [])

  return (
    <div className={styles.chatList}>
      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => router.push(`/chat/${chat.id}`)}
          className={styles.chatItem}
        >
          <Image
            src={chat.image || '/default_avatar.png'}
            alt={chat.name}
            width={40}
            height={40}
            className={`${styles.chatAvatar} ${
              !chat.image ? styles.default : ''
            }`}
          />
          <div className={styles.chatInfo}>
            <h3 className={styles.chatName}>{chat.name}</h3>
            <p className={styles.chatLastMessage}>
              {chat.lastMessage
                ? typeof chat.lastMessage === 'string'
                  ? chat.lastMessage
                  : chat.lastMessage.content || chat.lastMessage.text || ''
                : 'No messages yet'}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
