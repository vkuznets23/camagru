'use client'

import Image from 'next/image'
import styles from '@/styles/PostModal.module.css'
import Link from 'next/link'

export default function UserInfo({
  username,
  avatar,
  avatarBlurDataURL,
  createdAt,
  userID,
}: {
  username: string
  avatar: string | undefined
  avatarBlurDataURL?: string | undefined
  createdAt: string
  userID: string
}) {
  return (
    <div className={styles.usernamePanel}>
      <Link href={`/user/${userID}`}>
        <Image
          className={styles.avatar}
          src={avatar || '/default_avatar.png'}
          alt="avatar"
          width={32}
          height={32}
          placeholder={avatarBlurDataURL ? 'blur' : undefined}
          blurDataURL={avatarBlurDataURL ?? undefined}
        />
      </Link>
      <div className={styles.postMeta}>
        <Link href={`/user/${userID}`}>
          <p className={styles.username}>{username}</p>
        </Link>
        <small className={styles.postDate}>
          {new Date(createdAt).toLocaleString()}
        </small>
      </div>
    </div>
  )
}
