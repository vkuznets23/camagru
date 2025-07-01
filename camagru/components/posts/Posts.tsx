'use client'

import PostCard from './PostCard'
import styles from '@/styles/Profile.module.css'
import { type Post } from '@/types/post'
import { useSession } from 'next-auth/react'
import { usePosts, PostsProvider } from '@/context/PostsContext'

interface UserPostsProps {
  posts: Post[]
}

function UserPostsContent() {
  const { posts, setPosts } = usePosts()

  const { data: session } = useSession()
  const userID = session?.user?.id

  if (!userID) return <p>Loading user...</p>

  if (posts.length === 0) {
    return (
      <div>
        <p
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '120px',
          }}
        >
          No posts yet.
        </p>
      </div>
    )
  }

  return (
    <div className={styles.posts}>
      <div className={styles.postsContainer}>
        {posts
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((post) => (
            <PostCard
              key={post.id}
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
              // isLiked={post.likedByCurrentUser ?? false}
              // likesCount={post.likesCount ?? 0}
              // canEdit={post.user.id === userID}
              currentUserId={userID}
              // postAuthorId={post.user.id}
            />
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
