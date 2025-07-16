'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { type User } from '@/types/user'
import styles from '@/styles/Profile.module.css'
import Image from 'next/image'
import UserSkeleton from './UserSkeleton'
import UsernamePanel from './UsernamePanel'
import UserContentTabs from '../posts/UserContentTabs'
// import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function UserProfile() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  const [isFollowing, setIsFollowing] = useState(false)
  const [followersCount, setFollowersCount] = useState<number>(0)

  const handleFollow = async () => {
    const res = await fetch('/api/follow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user?.id }),
    })
    if (res.ok) {
      setIsFollowing(true)
      setFollowersCount((prev) => prev + 1)
    }
  }

  const handleUnfollow = async () => {
    const res = await fetch('/api/unfollow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user?.id }),
    })
    if (res.ok) {
      setIsFollowing(false)
      setFollowersCount((prev) => Math.max(prev - 1, 0))
    }
  }

  useEffect(() => {
    if (!id || !session?.user?.id) return

    const isOwnProfile = session.user.id === id

    const fetchUser = async (isOwnProfile: boolean = false) => {
      try {
        setLoading(true)

        const res = await fetch(`/api/user/${id}`)
        if (!res.ok) {
          setUser(null)
          return
        }
        const data = await res.json()
        setUser(data)
        setFollowersCount(data._count.followers)

        if (!isOwnProfile) {
          const followRes = await fetch(`/api/user/${id}/is-following`)
          if (followRes.ok) {
            const followData = await followRes.json()
            setIsFollowing(followData.following)
          }
        }
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchUser(isOwnProfile)
  }, [id, session?.user.id])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  if (loading || !user) {
    return <UserSkeleton />
  }

  // if (!session) {
  //   return (
  //     <p>
  //       u need to <Link href="/auth/signin">sign in</Link>
  //     </p>
  //   )
  // }

  const isMyProfile = session?.user?.id === user.id

  return (
    <div
      className={styles.userContainer}
      role="region"
      aria-label={`${user.name}'s profile`}
    >
      <div className={styles.profileContainer}>
        <Image
          src={user.image || '/default_avatar.png'}
          width={100}
          height={100}
          alt={`${user.name || 'User'}'s profile picture`}
          className={styles.avatar}
          priority
          onError={(e) => (e.currentTarget.src = '/default_avatar.png')}
        />

        <UsernamePanel
          user={user}
          isMyProfile={isMyProfile}
          isFollowing={isFollowing}
          onFollow={handleFollow}
          onUnfollow={handleUnfollow}
          followersCount={followersCount}
        />
      </div>

      <UserContentTabs posts={user.posts} />
    </div>
  )
}
