'use client'

import Image from 'next/image'
import styles from '@/styles/PostModal.module.css'

export default function UserInfo({
  username,
  avatar,
  createdAt,
}: {
  username: string
  avatar: string | undefined
  createdAt: string
}) {
  return (
    <div className={styles.usernamePanel}>
      <Image
        className={styles.avatar}
        src={avatar || '/default_avatar.png'}
        alt="avatar"
        width={32}
        height={32}
      />
      <div className={styles.postMeta}>
        <p className={styles.username}>{username}</p>
        <small className={styles.postDate}>
          {new Date(createdAt).toLocaleString()}
        </small>
      </div>
    </div>
  )
}
