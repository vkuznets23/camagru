'use client'

import Link from 'next/link'
import { MdOutlineEdit } from 'react-icons/md'

interface Props {
  isMyProfile: boolean
  isFollowing?: boolean
  onFollow?: () => void
  onUnfollow?: () => void
  username: string
  classNameEdit?: string
  classNameFollow?: string
}

export default function ProfileActionButton({
  isMyProfile,
  isFollowing,
  onFollow,
  onUnfollow,
  username,
  classNameEdit,
  classNameFollow,
}: Props) {
  if (isMyProfile) {
    return (
      <Link
        data-testid="edit-user"
        href="/edit-user"
        className={classNameEdit}
        aria-label="Edit profile"
      >
        <MdOutlineEdit aria-hidden="true" /> <span> Edit Profile</span>
      </Link>
    )
  }

  return (
    <button
      data-testid="follow-user"
      className={classNameFollow}
      onClick={isFollowing ? onUnfollow : onFollow}
      aria-label={isFollowing ? `Unfollow ${username}` : `Follow ${username}`}
      aria-pressed={isFollowing}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  )
}
