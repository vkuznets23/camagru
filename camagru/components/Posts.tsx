'use client'

import PostCard from '@/components/PostCard'
import styles from '@/styles/Profile.module.css'

type Post = {
  id: string
  image: string
  content: string
  createdAt: string
}

export default function UserPosts({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return <p>No posts yet.</p>
  }

  return (
    <div className={styles.posts}>
      <div className={styles.postsContainer}>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            image={post.image}
            content={post.content}
            createdAt={post.createdAt}
          />
        ))}
      </div>
    </div>
  )
}
