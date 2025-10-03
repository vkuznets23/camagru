import styles from '@/styles/MessageBubble.module.css'
import Image from 'next/image'

export interface Message {
  id: string
  content: string
  senderId: string
  createdAt: string
  sender: {
    name: string
    image?: string
  }
}

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  return (
    <div
      className={`${styles.messageContainer} ${
        isOwn ? styles.own : styles.other
      }`}
    >
      {!isOwn && (
        <div className={styles.messageWithAvatar}>
          <Image
            src={message.sender.image || '/default_avatar.png'}
            alt={'User avatar'}
            width={32}
            height={32}
            className={styles.messageAvatar}
          />
        </div>
      )}

      <div
        className={`${styles.messageBubble} ${
          isOwn ? styles.own : styles.other
        }`}
      >
        <p className={styles.messageContent}>{message.content}</p>
        <div
          className={`${styles.messageTime} ${
            isOwn ? styles.own : styles.other
          }`}
        >
          {formatTime(message.createdAt)}
        </div>
      </div>
    </div>
  )
}
