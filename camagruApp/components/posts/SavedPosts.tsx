'use client'

import PostCard from '@/components/posts/PostCard'
import styles from '@/styles/Profile.module.css'
import { useSession } from 'next-auth/react'
import NoPosts from '@/components/posts/NoPosts'
import { useUser } from '@/context/userContext'

export default function SavedPosts() {
  const { data: session, status } = useSession()
  const { user, handleCommentAdded } = useUser()

  const userID = session?.user?.id
  const isLoadingSession = status === 'loading'

  if (!userID || isLoadingSession) return
  if (!user?.savedPosts || user.savedPosts.length === 0) return <NoPosts />

  return (
    <div className={styles.posts}>
      <div className={styles.postsContainer} role="list">
        {user.savedPosts.slice().map((post, index) => (
          <article
            key={post.id}
            role="listitem"
            className={styles.postCardСardWrapper}
          >
            <PostCard
              post={post}
              onCommentAdded={handleCommentAdded}
              currentUserId={userID}
              priority={index < 3}
            />
          </article>
        ))}
      </div>
    </div>
  )
}
