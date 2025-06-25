'use client'

import PostCard from './PostCard'
import styles from '@/styles/Profile.module.css'
import { type Post } from '@/types/post'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

interface UserPostsProps {
  posts: Post[]
}

export default function UserPosts({ posts }: UserPostsProps) {
  const [postsList, setPostsList] = useState<Post[]>(posts)

  const { data: session } = useSession()
  const userID = session?.user?.id

  const handleEditPost = async (postId: string, newContent: string) => {
    try {
      const res = await fetch(`/api/posts?postId=${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent }),
      })

      if (!res.ok) {
        throw new Error('Failed to update post')
      }

      const updatedPost = await res.json()

      setPostsList((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, content: updatedPost.content } : post
        )
      )
    } catch (error) {
      console.error(error)
    }
  }

  const handleToggleLike = async (postId: string) => {
    try {
      const res = await fetch('/api/posts/like', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      })

      if (res.ok) {
        const updatedPost = await res.json()

        setPostsList((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likedByCurrentUser: updatedPost.likedByCurrentUser,
                  likesCount: updatedPost.likesCount,
                }
              : post
          )
        )
      } else {
        console.error('Failed to toggle like')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handlePostDeleted = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts?postId=${postId}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        throw new Error('Failed to delete post')
      }
      setPostsList((prevPosts) =>
        prevPosts.filter((post) => post.id !== postId)
      )
    } catch (error) {
      console.error(error)
    }
  }

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

  if (!userID) return <p>Loading user...</p>

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
              onPostDeleted={() => handlePostDeleted(post.id)}
              isLiked={post.likedByCurrentUser ?? false}
              likesCount={post.likesCount ?? 0}
              onToggleLike={() => handleToggleLike(post.id)}
              canEdit={post.user.id === userID}
              onEditPost={(newContent) => handleEditPost(post.id, newContent)}
            />
          ))}
      </div>
    </div>
  )
}
