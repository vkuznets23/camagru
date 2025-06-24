import styles from '@/styles/Profile.module.css'

interface Props {
  posts: number
  followers: number
  following: number
}

export default function UserStats({ posts, followers, following }: Props) {
  return (
    <div className={styles.followersContainer}>
      <div>
        <strong>{posts}</strong> posts
      </div>
      <div>
        <strong>{followers}</strong> followers
      </div>
      <div>
        <strong>{following}</strong> following
      </div>
    </div>
  )
}
