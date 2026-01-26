'use client'

import PostCard from '@/components/posts/PostCard'
import styles from '@/styles/Profile.module.css'
import { useSession } from 'next-auth/react'
import NoPosts from '@/components/posts/NoPosts'
import { useUser } from '@/context/userContext'

export default function UserPosts() {
  const { data: session, status } = useSession()
  const { user, handleCommentAdded } = useUser()

  const userID = session?.user?.id
  const isLoadingSession = status === 'loading'

  if (!userID || isLoadingSession) return
  if (!user?.posts || user.posts.length === 0) return <NoPosts />

  return (
    <div className={styles.posts}>
      <ul className={styles.postsContainer}>
        {user.posts
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .map((post, index) => (
            <li key={post.id} className={styles.postCardСardWrapper}>
              <PostCard
                post={post}
                onCommentAdded={handleCommentAdded}
                currentUserId={userID}
                priority={index < 3}
              />
            </li>
          ))}
      </ul>
    </div>
  )
}
