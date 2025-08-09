'use client'

import PostCard from '@/components/posts/PostCard'
import styles from '@/styles/Profile.module.css'
import { type Post } from '@/types/post'
import { useSession } from 'next-auth/react'
import { usePosts, PostsProvider } from '@/context/PostsContext'
import NoPosts from '@/components/posts/NoPosts'

interface UserPostsProps {
  posts: Post[]
}

function UserPostsContent() {
  const { posts, setPosts } = usePosts()

  const { data: session, status } = useSession()
  const userID = session?.user?.id

  const isLoadingSession = status === 'loading'

  if (!userID) return

  if (isLoadingSession) {
    return
  }

  if (!posts || posts.length === 0) {
    return <NoPosts />
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
                onCommentAdded={(postId, newComment) => {
                  setPosts((prevPosts) =>
                    prevPosts.map((p) =>
                      p.id === postId
                        ? { ...p, comments: [newComment, ...p.comments] }
                        : p
                    )
                  )
                }}
                currentUserId={userID}
                priority={index < 3}
              />
            </article>
          ))}
      </div>
    </div>
  )
}

export default function UserPosts({ posts }: UserPostsProps) {
  return (
    <PostsProvider initialPosts={posts}>
      <UserPostsContent />
    </PostsProvider>
  )
}
