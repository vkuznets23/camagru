'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import styles from '@/styles/Profile.module.css'

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

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`/api/user/${id}`)
      const data = await res.json()
      setUser(data)
    }
    if (id) fetchUser()
  }, [id])

  if (!user) return <div>Loading...</div>

  return (
    <div className={styles.profileContainer}>
      <Image
        src={user.image || '/default_avatar.png'}
        width={100}
        height={100}
        alt="avatar"
        className={styles.avatar}
      />
      <div className={styles.profileInfo}>
        <h2>{user.username}</h2>
        <p>{user.name}</p>
        <p>{user.bio}</p>
      </div>
    </div>
  )
}
