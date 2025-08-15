'use client'

import Image from 'next/image'
import Link from 'next/link'
import styles from '@/styles/FollowersPage.module.css'

export type FollowerPreview = {
  id: string
  username: string
  name?: string | null
  bio?: string | null
  image?: string | null
}

type UserListProps = {
  users: FollowerPreview[]
  emptyMessage: string
  noPadding?: boolean
}

export default function UserList({
  users,
  emptyMessage,
  noPadding = false,
}: UserListProps) {
  return (
    <div className={noPadding ? styles.noPaddingContainer : styles.container}>
      {users.length === 0 ? (
        <p className={styles.empty}>{emptyMessage}</p>
      ) : (
        <ul className={styles.list}>
          {users.map((user) => (
            <li key={user.id} className={styles.userRow}>
              <Link href={`/user/${user.id}`} className={styles.item}>
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
                      {user.bio.length > 50
                        ? user.bio.slice(0, 50) + '…'
                        : user.bio}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
