'use client'

import PostCard from './PostCard'
import styles from '@/styles/Profile.module.css'
import { type Post } from '@/types/post'
import { useState } from 'react'

interface UserPostsProps {
  posts: Post[]
}

export default function UserPosts({ posts }: UserPostsProps) {
  const [postsList, setPostsList] = useState<Post[]>(posts)

  if (postsList.length === 0) {
    return <p>No posts yet.</p>
  }

  return (
    <div className={styles.posts}>
      <div className={styles.postsContainer}>
        {postsList
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
              onCommentAdded={(postId, newComment) => {
                setPostsList((prevPosts) =>
                  prevPosts.map((p) =>
                    p.id === postId
                      ? { ...p, comments: [newComment, ...p.comments] }
                      : p
                  )
                )
              }}
            />
          ))}
      </div>
    </div>
  )
}
