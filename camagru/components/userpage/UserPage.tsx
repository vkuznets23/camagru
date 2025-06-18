'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { type User } from '@/types/user'
import styles from '@/styles/Profile.module.css'
import Image from 'next/image'
import UserPosts from '../posts/Posts'
import UserSkeleton from './UserSkeleton'
import UsernamePanel from './UsernamePanel'

export default function UserProfile() {
  const params = useParams()
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  const { data: session } = useSession()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)

        const res = await fetch(`/api/user/${id}`)
        if (!res.ok) {
          setUser(null)
          return
        }
        const data = await res.json()
        setUser(data)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchUser()
  }, [id])

  if (loading || !user) {
    return <UserSkeleton />
  }

  const isMyProfile = session?.user?.id === user.id

  return (
    <div className={styles.userContainer}>
      <div className={styles.profileContainer}>
        <Image
          src={user.image || '/default_avatar.png'}
          width={100}
          height={100}
          alt="avatar"
          className={styles.avatar}
          priority
          onError={(e) => (e.currentTarget.src = '/default_avatar.png')}
        />
        <div className={styles.profileInfo}>
          <UsernamePanel user={user} isMyProfile={isMyProfile} />
        </div>
      </div>
      <UserPosts posts={user.posts} />
    </div>
  )
}
