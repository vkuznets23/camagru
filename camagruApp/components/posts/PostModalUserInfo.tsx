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
    <div className={styles.usernamePanel} id="post-author">
      <Link href={`/user/${userID}`} aria-label={`View ${username}'s profile`}>
        <Image
          className={styles.avatar}
          src={avatar || '/default_avatar.png'}
          alt={`${username}'s avatar`}
          width={32}
          height={32}
          placeholder={avatarBlurDataURL ? 'blur' : undefined}
          blurDataURL={avatarBlurDataURL ?? undefined}
        />
      </Link>
      <div className={styles.postMeta}>
        <Link
          href={`/user/${userID}`}
          aria-label={`View ${username}'s profile`}
        >
          <p className={styles.username}>{username}</p>
        </Link>
        <small
          className={styles.postDate}
          aria-label={`Posted on ${new Date(createdAt).toLocaleString()}`}
        >
          {new Date(createdAt).toLocaleString()}
        </small>
      </div>
    </div>
  )
}
