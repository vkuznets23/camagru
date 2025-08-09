import Image from 'next/image'
import Link from 'next/link'
import styles from '@/styles/FollowersPage.module.css'

export type FollowerPreview = {
  id: string
  username: string
  image?: string | null
}

type UserListProps = {
  users: FollowerPreview[]
  emptyMessage: string
}

export default function UserList({ users, emptyMessage }: UserListProps) {
  return (
    <div className={styles.container}>
      {users.length === 0 ? (
        <p className={styles.empty}>{emptyMessage}</p>
      ) : (
        <ul className={styles.list}>
          {users.map((user) => (
            <li key={user.id}>
              <Link href={`/user/${user.id}`} className={styles.item}>
                <Image
                  className={styles.image}
                  src={user.image || '/default_avatar.png'}
                  alt={`${user.username}'s avatar`}
                  width={40}
                  height={40}
                  priority
                />
                <span>{user.username}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
