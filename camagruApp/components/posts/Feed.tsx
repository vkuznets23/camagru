'use client'

import PostCard from '@/components/posts/PostCard'
import styles from '@/styles/Profile.module.css'
import NoPosts from '@/components/posts/NoPosts'
import { Post } from '@/types/post'
import { Comment } from '@/types/comment'
import { useUser } from '@/context/userContext'

type FeedPosts = {
  posts: Post[]
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
}
export default function FeedPosts({ posts, setPosts }: FeedPosts) {
  const { user, setUser } = useUser()

  if (!user) return null
  if (!posts || posts.length === 0) return <NoPosts />

  const handleCommentAdded = (postId: string, newComment: Comment) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [newComment, ...p.comments] } : p
      )
    )
    setUser((prev) =>
      prev
        ? {
            ...prev,
            posts: prev.posts.map((p) =>
              p.id === postId
                ? { ...p, comments: [newComment, ...(p.comments || [])] }
                : p
            ),
          }
        : prev
    )
  }

  return (
    <div className={styles.posts}>
      <div className={styles.postsContainer} role="list">
        {posts
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((post, index) => (
            <article key={post.id} role="listitem">
              <PostCard
                post={post}
                onCommentAdded={handleCommentAdded}
                currentUserId={user.id}
                priority={index < 3}
              />
            </article>
          ))}
      </div>
    </div>
  )
}
