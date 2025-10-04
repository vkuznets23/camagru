import styles from '@/styles/MessageBubble.module.css'
import Image from 'next/image'
import { memo, useMemo } from 'react'

export interface Message {
  id: string
  content: string
  senderId: string
  createdAt: string
  sender: {
    username: string
    name?: string
    image?: string
  }
}

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
}

function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const formattedTime = useMemo(() => {
    const date = new Date(message.createdAt)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }, [message.createdAt])

  return (
    <div
      className={`${styles.messageContainer} ${
        isOwn ? styles.own : styles.other
      }`}
    >
      {!isOwn && (
        <div
          className={
            message.sender.image
              ? styles.messageWithAvatar
              : styles.messageWithAvatarEmpty
          }
        >
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
          {formattedTime}
        </div>
      </div>
    </div>
  )
}

export default memo(MessageBubble)
