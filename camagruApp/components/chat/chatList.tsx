import { useEffect, memo } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useChatContext } from '@/contexts/ChatContext'
import { useChatSidebar } from '@/contexts/ChatSidebarContext'
import styles from '@/styles/Chat.module.css'

function ChatList() {
  const { chats, refreshChats } = useChatContext()
  const { selectChat } = useChatSidebar()
  const pathname = usePathname()
  const activeChatId = pathname?.split('/').pop()

  useEffect(() => {
    refreshChats()
  }, [refreshChats])

  return (
    <div className={styles.chatList}>
      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => selectChat(chat.id)}
          className={`${styles.chatItem} ${
            activeChatId === chat.id ? styles.active : ''
          }`}
          aria-current={activeChatId === chat.id ? 'page' : undefined}
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
          {chat.unreadCount ? (
            <span className={styles.chatUnreadBadge}>
              {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export default memo(ChatList)
