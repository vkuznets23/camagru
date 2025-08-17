import { createContext, useContext, useState, ReactNode } from 'react'
import { type User } from '@/types/user'
import { Post } from '@/types/post'
import { Comment } from '@/types/comment'

interface UserContextType {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  editPost: (postId: string, newContent: string) => Promise<void>
  toggleLike: (postId: string) => Promise<void>
  deletePost: (postId: string) => Promise<void>
  deleteComment: (postId: string, commentId: string) => Promise<void>
  handleCommentAdded: (postId: string, newComment: Comment) => void

  posts: Post[]
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>

  savedPosts: Post[]
  toggleSavePost: (post: Post) => Promise<void>
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({
  children,
  initialUser,
  initialPosts,
}: {
  children: ReactNode
  initialUser: User | null
  initialPosts: Post[] | []
}) {
  const [user, setUser] = useState<User | null>(initialUser)
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [savedPosts, setSavedPosts] = useState<Post[]>(
    initialUser?.savedPosts || []
  )

  const toggleSavePost = async (post: Post) => {
    try {
      const res = await fetch(`/api/posts/save`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          postId: post.id,
          save: !post.savedByCurrentUser,
        }),
      })

      if (!res.ok) throw new Error('Failed to toggle save')

      const updatedPost: Post = await res.json()

      setPosts((prev) =>
        prev.map((p) =>
          p.id === updatedPost.id
            ? { ...p, savedByCurrentUser: updatedPost.savedByCurrentUser }
            : p
        )
      )

      setSavedPosts((prev) =>
        updatedPost.savedByCurrentUser
          ? [updatedPost, ...prev.filter((p) => p.id !== updatedPost.id)]
          : prev.filter((p) => p.id !== updatedPost.id)
      )

      setUser((prevUser) =>
        prevUser
          ? {
              ...prevUser,
              savedPosts: updatedPost.savedByCurrentUser
                ? [updatedPost, ...(prevUser.savedPosts || [])]
                : (prevUser.savedPosts || []).filter(
                    (p) => p.id !== updatedPost.id
                  ),
              posts: prevUser.posts?.map((p) =>
                p.id === updatedPost.id
                  ? { ...p, savedByCurrentUser: updatedPost.savedByCurrentUser }
                  : p
              ),
            }
          : prevUser
      )
    } catch (err) {
      console.error(err)
    }
  }

  const editPost = async (postId: string, newContent: string) => {
    const res = await fetch(`/api/posts?postId=${postId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newContent }),
    })
    if (!res.ok) throw new Error('Failed to update post')
    const updatedPost = await res.json()

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, content: updatedPost.content } : p
      )
    )

    setUser((prev) =>
      prev
        ? {
            ...prev,
            posts: prev.posts.map((p) =>
              p.id === postId ? { ...p, content: updatedPost.content } : p
            ),
          }
        : prev
    )
  }

  const toggleLike = async (postId: string) => {
    const res = await fetch('/api/posts/like', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }),
    })
    if (!res.ok) throw new Error('Failed to toggle like')
    const updatedPost = await res.json()

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              likedByCurrentUser: updatedPost.likedByCurrentUser,
              likesCount: updatedPost.likesCount,
            }
          : p
      )
    )

    setUser((prev) =>
      prev
        ? {
            ...prev,
            posts: prev.posts.map((p) =>
              p.id === postId
                ? {
                    ...p,
                    likedByCurrentUser: updatedPost.likedByCurrentUser,
                    likesCount: updatedPost.likesCount,
                  }
                : p
            ),
          }
        : prev
    )
  }

  const deletePost = async (postId: string) => {
    const res = await fetch(`/api/posts?postId=${postId}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete post')

    setPosts((prev) => prev.filter((p) => p.id !== postId))

    setUser((prev) =>
      prev
        ? {
            ...prev,
            posts: prev.posts.filter((p) => p.id !== postId),
            _count: { ...prev._count, posts: prev._count.posts - 1 },
          }
        : prev
    )
  }

  const deleteComment = async (postId: string, commentId: string) => {
    const res = await fetch(`/api/comments/by-id/${commentId}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to delete comment')

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: p.comments?.filter((c) => c.id !== commentId) || [],
            }
          : p
      )
    )

    setUser((prev) =>
      prev
        ? {
            ...prev,
            posts: prev.posts.map((p) =>
              p.id === postId
                ? {
                    ...p,
                    comments:
                      p.comments?.filter((c) => c.id !== commentId) || [],
                  }
                : p
            ),
          }
        : prev
    )
  }

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
    <UserContext.Provider
      value={{
        user,
        setUser,
        posts,
        setPosts,
        editPost,
        toggleLike,
        deletePost,
        deleteComment,
        handleCommentAdded,
        savedPosts,
        toggleSavePost,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}
