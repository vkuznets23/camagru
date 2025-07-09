import Link from 'next/link'
import styles from '@/styles/Profile.module.css'
import { MdOutlineEdit } from 'react-icons/md'
import UserStats from './UserStats'
import UserBio from './UserBio'
import { type User } from '@/types/user'

interface Props {
  user: User
  isMyProfile: boolean
  isFollowing?: boolean
  onFollow?: () => void
  onUnfollow?: () => void
  followersCount?: number
}

export default function UsernamePanel({
  user,
  isMyProfile,
  isFollowing,
  onFollow,
  onUnfollow,
  followersCount,
}: Props) {
  return (
    <div className={styles.profileInfo}>
      <div className={styles.usernamePanel}>
        <h1>{user.username}</h1>
        {isMyProfile ? (
          <Link
            data-testid="edit-user"
            href="/edit-user"
            className={styles.navBtn}
            aria-label="Edit profile"
          >
            <MdOutlineEdit aria-hidden="true" />
          </Link>
        ) : (
          <button
            data-testid="follow-user"
            className={styles.button}
            onClick={isFollowing ? onUnfollow : onFollow}
            aria-label={
              isFollowing
                ? `Unfollow ${user.username}`
                : `Follow ${user.username}`
            }
            aria-pressed={isFollowing}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>
      <UserStats
        userid={user.id}
        posts={user._count.posts}
        followers={followersCount ?? user._count.followers}
        following={user._count.following}
      />
      <UserBio name={user.name} bio={user.bio} />
    </div>
  )
}
