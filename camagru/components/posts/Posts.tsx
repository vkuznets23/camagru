'use client'

import PostCard from './PostCard'
import styles from '@/styles/Profile.module.css'
import { type Post } from '@/types/post'

interface UserPostsProps {
  posts: Post[]
}

export default function UserPosts({ posts }: UserPostsProps) {
  if (posts.length === 0) {
    return <p>No posts yet.</p>
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
              id={post.id}
              image={post.image}
              content={post.content}
              createdAt={post.createdAt}
              username={post.user.username}
              avatar={post.user.image}
              comments={post.comments}
            />
          ))}
      </div>
    </div>
  )
}
