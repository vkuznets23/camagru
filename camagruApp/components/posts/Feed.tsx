'use client'

import PostCard from '@/components/posts/PostCard'
import styles from '@/styles/Profile.module.css'
import NoPosts from '@/components/posts/NoPosts'
import { Post } from '@/types/post'
import { useUser } from '@/context/userContext'

type FeedPosts = {
  posts: Post[]
}
export default function FeedPosts({ posts }: FeedPosts) {
  const { user, handleCommentAdded } = useUser()

  if (!posts || posts.length === 0) return <NoPosts />

  return (
    <div className={styles.posts}>
      <ul className={styles.postsContainer}>
        {posts
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .map((post, index) => (
            <li key={post.id}>
              <PostCard
                post={post}
                onCommentAdded={handleCommentAdded}
                currentUserId={user?.id || ''}
                priority={index < 3 && user?.id ? true : false}
              />
            </li>
          ))}
      </ul>
    </div>
  )
}
