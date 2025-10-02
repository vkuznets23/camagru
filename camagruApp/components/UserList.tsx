'use client'

import Image from 'next/image'
import Link from 'next/link'
import styles from '@/styles/FollowersPage.module.css'
import { useSession } from 'next-auth/react'
import { HistoryItem } from './navbar/MobileSearchPage'
import { useRouter } from 'next/navigation'

export type FollowerPreview = {
  id: string
  username: string
  name?: string | null
  bio?: string | null
  image?: string | null
  isFollowing?: boolean
  followsYou?: boolean
}

type UserListProps = {
  users: FollowerPreview[]
  emptyMessage: string
  noPadding?: boolean
  onToggleFollow?: (userId: string) => void
  onUserClick?: (username: FollowerPreview) => void
  renderExtra?: (user: FollowerPreview | HistoryItem) => React.ReactNode
}

export default function UserList({
  users,
  emptyMessage,
  noPadding = false,
  onToggleFollow,
  onUserClick,
  renderExtra,
}: UserListProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const currentUserId = session?.user?.id

  const handleSendMessage = async (userId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    try {
      const response = await fetch('/api/chats/direct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        const { chat } = await response.json()
        router.push(`/chat/${chat.id}`)
      } else {
        console.error('Failed to create chat')
      }
    } catch (error) {
      console.error('Error creating chat:', error)
    }
  }

  console.log(users)

  return (
    <div className={noPadding ? styles.noPaddingContainer : styles.container}>
      {users.length === 0 ? (
        <p className={styles.empty}>{emptyMessage}</p>
      ) : (
        <ul className={styles.list}>
          {users.map((user) => (
            <li
              key={user.id}
              className={styles.userRow}
              onClick={() => onUserClick && onUserClick(user)}
            >
              <div className={styles.item}>
                <Link href={`/user/${user.id}`} className={styles.itemLink}>
                  <Image
                    className={styles.image}
                    src={user.image || '/default_avatar.png'}
                    alt={`${user.username}'s avatar`}
                    width={40}
                    height={40}
                    priority
                  />
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{user.username}</span>
                    {user.bio && (
                      <span className={styles.userBio}>
                        {user.bio.length > 30
                          ? user.bio.slice(0, 30) + '…'
                          : user.bio}
                      </span>
                    )}
                  </div>
                </Link>
                <div className={styles.actions}>
                  {user.id !== currentUserId && (
                    <button
                      className={styles.messageBtn}
                      onClick={(e) => handleSendMessage(user.id, e)}
                      title="Send message"
                    >
                      💬
                    </button>
                  )}
                  {onToggleFollow && user.id !== currentUserId && (
                    <button
                      className={styles.unfollowBtn}
                      onClick={() => onToggleFollow(user.id)}
                    >
                      {user.isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                  )}
                  {renderExtra && renderExtra(user)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
