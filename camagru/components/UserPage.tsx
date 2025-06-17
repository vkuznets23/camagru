'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { MdOutlineEdit } from 'react-icons/md'
import styles from '@/styles/Profile.module.css'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { type User } from '@/types/user'

export default function UserProfile() {
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
      <div data-testid="skeleton" className={styles.profileContainer}>
        <div className={styles.skeletonAvatar} />
        <div className={styles.profileInfo}>
          <div className={styles.skeletonTextShort} />
          <div className={styles.skeletonText} />
          <div className={styles.skeletonText} />
        </div>
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
        priority
        onError={(e) => (e.currentTarget.src = '/default_avatar.png')}
      />
      <div className={styles.profileInfo}>
        <div className={styles.usernamePanel}>
          <h2>{user.username}</h2>
          {isMyProfile ? (
            <Link
              data-testid="edit-user"
              href="/edit-user"
              className={styles.navBtn}
            >
              <MdOutlineEdit />
            </Link>
          ) : (
            <button data-testid="follow-user" className={styles.button}>
              follow
            </button>
          )}
        </div>
        <div className={styles.followersContainer}>
          <div>
            <strong>{user._count.posts} </strong> posts
          </div>
          <div>
            <strong>{user._count.followers}</strong> followers
          </div>
          <div>
            <strong>{user._count.following}</strong> following
          </div>
        </div>
        <h3>{user.name}</h3>
        <p className={styles.bio}>{user.bio}</p>
      </div>
      <div>
        <h3>Posts</h3>
        {user.posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          user.posts.map((post) => (
            <div
              key={post.id}
              style={{ borderBottom: '1px solid #ddd', padding: '0.5rem 0' }}
            >
              <p>{post.content}</p>
              {post.image && (
                <Image
                  width={200}
                  height={200}
                  src={post.image}
                  alt="Post image"
                  style={{ maxWidth: '100%', borderRadius: 8 }}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
