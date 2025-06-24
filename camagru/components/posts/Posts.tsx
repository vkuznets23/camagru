'use client'

import PostCard from './PostCard'
import styles from '@/styles/Profile.module.css'
import { type Post } from '@/types/post'
import { useEffect, useState } from 'react'

interface UserPostsProps {
  posts: Post[]
}

export default function UserPosts({ posts }: UserPostsProps) {
  const [postsList, setPostsList] = useState<Post[]>(posts)

  useEffect(() => {
    console.log('postsList changed:', postsList)
  }, [postsList])

  const handleCommentDeleted = async (postId: string, commentId: string) => {
    try {
      const res = await fetch(`/api/comments/by-id/${commentId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete comment')
      }

      setPostsList((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments
                  ? post.comments.filter((c) => c.id !== commentId)
                  : [],
              }
            : post
        )
      )
    } catch (error) {
      console.error(error)
    }
  }

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
              onCommentDeleted={(commentId) =>
                handleCommentDeleted(post.id, commentId)
              }
            />
          ))}
      </div>
    </div>
  )
}
