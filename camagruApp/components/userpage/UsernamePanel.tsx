import styles from '@/styles/Profile.module.css'
import UserStats from './UserStats'
import UserBio from './UserBio'
import { useUser } from '@/context/userContext'
import ProfileActionButton from './ActionButtons'

interface Props {
  isMyProfile: boolean
  isFollowing?: boolean
  onFollow?: () => void
  onUnfollow?: () => void
  followersCount?: number
}

export default function UsernamePanel({
  isMyProfile,
  isFollowing,
  onFollow,
  onUnfollow,
  followersCount,
}: Props) {
  const { user } = useUser()
  if (!user) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className={styles.profileInfo}>
        <div className={styles.usernamePanel}>
          <h1>{user.username}</h1>
          <ProfileActionButton
            isMyProfile={isMyProfile}
            isFollowing={isFollowing}
            onFollow={onFollow}
            onUnfollow={onUnfollow}
            username={user.username}
            classNameEdit={styles.navBtn}
            classNameFollow={styles.button}
          />
        </div>
        <UserStats
          userid={user.id}
          posts={user._count.posts}
          followers={followersCount ?? user._count.followers}
          following={user._count.following}
        />
        <UserBio name={user.name} bio={user.bio} />
      </div>
    </div>
  )
}
