import styles from '@/styles/Profile.module.css'
import Link from 'next/link'

interface Props {
  userid: string
  posts: number
  followers: number
  following: number
}

export default function UserStats({
  userid,
  posts,
  followers,
  following,
}: Props) {
  return (
    <div className={styles.followersContainer}>
      <div>
        <strong>{posts}</strong> posts
      </div>
      <div>
        <Link href={`/user/${userid}/followers`}>
          <strong>{followers}</strong> followers
        </Link>
      </div>
      <div>
        <Link href={`/user/${userid}/following`}>
          <strong>{following}</strong> following
        </Link>
      </div>
    </div>
  )
}
