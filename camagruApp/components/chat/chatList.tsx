import { useEffect, useState } from 'react'

interface Chat {
  id: string
  name: string
  image: string
  lastMessage: string
  participants: Participant[]
}

interface Participant {
  id: string
  name: string
  image: string
}

export default function ChatList() {
  const [chats, setChats] = useState<Chat[]>([])

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch('/api/chats')
        const data = await response.json()
        setChats(data)
        return data
      } catch (error) {
        console.error(error)
        return []
      }
    }
    fetchChats()
  }, [])

  return (
    <div>
      {chats.map((chat) => (
        <div key={chat.id}>
          <h2>{chat.name}</h2>
          <p>{chat.lastMessage}</p>
          <p>
            {chat.participants
              .map((participant) => participant.name)
              .join(', ')}
          </p>
        </div>
      ))}
    </div>
  )
}
