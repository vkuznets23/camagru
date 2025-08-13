'use client'

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  // useEffect,
  useMemo,
} from 'react'
import { type Post } from '@/types/post'

interface PostsContextType {
  posts: Post[]
  savedPosts: Post[]
  normalPosts: Post[]
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
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
}: {
  children: ReactNode
  initialPosts: Post[]
}) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)

  // useEffect(() => {
  //   setPosts(initialPosts)
  // }, [initialPosts])

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

  // const handleToggleSave = async (postId: string) => {
  //   setPosts((prev) =>
  //     prev.map((p) =>
  //       p.id === postId
  //         ? { ...p, savedByCurrentUser: !p.savedByCurrentUser }
  //         : p
  //     )
  //   )

  //   try {
  //     const post = posts.find((p) => p.id === postId)
  //     if (!post) return

  //     const res = await fetch(`/api/posts/${postId}/save`, {
  //       method: 'PATCH',
  //     })

  //     if (!res.ok) {
  //       throw new Error('Failed to toggle save')
  //     }

  //     const updatedPost = await res.json()

  //     setPosts((prev) =>
  //       prev.map((p) =>
  //         p.id === postId
  //           ? { ...p, savedByCurrentUser: updatedPost.savedByCurrentUser }
  //           : p
  //       )
  //     )
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }
  const savedPosts = useMemo(
    () => posts.filter((p) => p.savedByCurrentUser),
    [posts]
  )

  const normalPosts = useMemo(
    () => posts.filter((p) => !p.savedByCurrentUser),
    [posts]
  )

  const handleToggleSave = async (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, savedByCurrentUser: !p.savedByCurrentUser }
          : p
      )
    )

    try {
      const res = await fetch(`/api/posts/${postId}/save`, { method: 'PATCH' })
      if (!res.ok) throw new Error('Failed to toggle save')

      const updatedPost = await res.json()
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, savedByCurrentUser: updatedPost.savedByCurrentUser }
            : p
        )
      )
    } catch (error) {
      console.error(error)
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, savedByCurrentUser: !p.savedByCurrentUser }
            : p
        )
      )
    }
  }

  return (
    <PostsContext.Provider
      value={{
        posts,
        savedPosts,
        normalPosts,
        setPosts,
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
