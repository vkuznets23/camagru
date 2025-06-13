'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { MdOutlineEdit } from 'react-icons/md'
import styles from '@/styles/Profile.module.css'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

// take it from different part
type User = {
  id: string
  name: string
  username: string
  bio?: string
  image?: string
}

export default function UserProfilePage() {
  const params = useParams()
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id
  const [user, setUser] = useState<User | null>(null)

  const { data: session } = useSession()

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`/api/user/${id}`)
      if (!res.ok) {
        setUser(null)
        return
      }
      const data = await res.json()
      setUser(data)
    }
    if (id) fetchUser()
  }, [id])

  if (!user)
    return (
      <div className={styles.profileContainer}>
        <div className={styles.skeletonAvatar} />
        <div className={styles.skeletonText} />
        <div className={styles.skeletonTextShort} />
      </div>
    )

  const isMyProfile = session?.user?.id === user.id

  return (
    <div className={styles.profileContainer}>
      <Image
        src={user.image || '/default_avatar.png'}
        width={100}
        height={100}
        alt="avatar"
        className={styles.avatar}
        onError={(e) => (e.currentTarget.src = '/default_avatar.png')}
      />
      <div className={styles.profileInfo}>
        <div className={styles.usernamePanel}>
          <h2>{user.username}</h2>
          {isMyProfile ? (
            <Link href="/settings" className={styles.navBtn}>
              <MdOutlineEdit />
            </Link>
          ) : (
            <button className={styles.button}>follow</button>
          )}
        </div>
        <h3>{user.name}</h3>
        <p>{user.bio}</p>
      </div>
    </div>
  )
}
