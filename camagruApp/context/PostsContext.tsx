'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { type Post } from '@/types/post'
import { User } from '@/types/user'

interface PostsContextType {
  posts: Post[]
  savedPosts: Post[]
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
  user: User
  setUser: React.Dispatch<React.SetStateAction<User>>
  handleEditPost: (postId: string, newContent: string) => Promise<void>
  handleToggleLike: (postId: string) => Promise<void>
  handlePostDeleted: (postId: string) => Promise<void>
  handleCommentDeleted: (postId: string, commentId: string) => Promise<void>
  handleToggleSave: (postId: string) => Promise<void>
}

export const PostsContext = createContext<PostsContextType | undefined>(
  undefined
)

export function PostsProvider({
  children,
  initialPosts,
  initialUser,
}: {
  children: ReactNode
  initialPosts: Post[]
  initialUser: User
}) {
  const [posts, setPosts] = useState<Post[]>(
    initialPosts.map((p) => ({
      ...p,
      savedBy: p.savedBy || [],
      savedByCurrentUser:
        p.savedBy?.some((u) => u.id === initialUser.id) || false,
    }))
  )
  const [user, setUser] = useState<User>(initialUser)
  const [savedPosts, setSavedPosts] = useState<Post[]>(
    initialUser.savedPosts || []
  )

  console.log('posts', posts)
  console.log('savedPosts', savedPosts)

  const updateSavedPosts = (updatedPosts: Post[], updatedUser: User) => {
    setSavedPosts(
      updatedPosts.filter((p) =>
        updatedUser.savedPosts?.some((sp) => sp.id === p.id)
      )
    )
  }

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

      setPosts((prevPosts) =>
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

        setPosts((prevPosts) =>
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
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId))
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

      setPosts((prevPosts) =>
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

  const handleToggleSave = async (postId: string) => {
    setPosts((prevPosts) => {
      const newPosts = prevPosts.map((p) => {
        if (p.id !== postId) return p
        const isSaved = !p.savedByCurrentUser
        const savedBy = isSaved
          ? [...(p.savedBy || []), user]
          : (p.savedBy || []).filter((u) => u.id !== user.id)
        return { ...p, savedBy, savedByCurrentUser: isSaved }
      })

      const newUser = {
        ...user,
        savedPosts: newPosts.filter((p) => p.savedByCurrentUser),
      }
      setUser(newUser)
      updateSavedPosts(newPosts, newUser)

      return newPosts
    })

    try {
      const res = await fetch(`/api/posts/${postId}/save`, { method: 'PATCH' })
      if (!res.ok) throw new Error('Failed to toggle save')
      const updatedPost = await res.json()

      setPosts((prevPosts) => {
        const newPosts = prevPosts.map((p) =>
          p.id === postId
            ? {
                ...p,
                savedByCurrentUser: updatedPost.savedByCurrentUser,
                savedBy: updatedPost.savedBy || [],
              }
            : p
        )
        const newUser = {
          ...user,
          savedPosts: newPosts.filter((p) => p.savedByCurrentUser),
        }
        setUser(newUser)
        updateSavedPosts(newPosts, newUser)
        return newPosts
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <PostsContext.Provider
      value={{
        posts,
        setPosts,
        user,
        setUser,
        savedPosts,
        handleEditPost,
        handleToggleLike,
        handlePostDeleted,
        handleCommentDeleted,
        handleToggleSave,
      }}
    >
      {children}
    </PostsContext.Provider>
  )
}

export function usePosts() {
  const context = useContext(PostsContext)
  if (!context) throw new Error('usePosts must be used within PostsProvider')
  return context
}
