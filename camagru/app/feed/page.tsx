'use client'

import { type Post } from '@/types/post'
import { useEffect, useState, useCallback, useRef } from 'react'
import UserPosts from '@/components/posts/Posts'

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const loadingRef = useRef(loading)
  const [hasMore, setHasMore] = useState(true)
  const hasMoreRef = useRef(hasMore)
  const limit = 12
  const postsCountRef = useRef(0)

  useEffect(() => {
    loadingRef.current = loading
  }, [loading])
  useEffect(() => {
    hasMoreRef.current = hasMore
  }, [hasMore])

  const fetchPosts = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return

    setLoading(true)
    try {
      const skip = postsCountRef.current

      const response = await fetch(`/api/feed?skip=${skip}&limit=${limit}`)
      if (!response.ok) throw new Error('Failed to fetch posts')
      const data: Post[] = await response.json()

      setPosts((prev) => {
        const newPosts = data.filter(
          (newPost) => !prev.some((post) => post.id === newPost.id)
        )
        postsCountRef.current = prev.length + newPosts.length
        return [...prev, ...newPosts]
      })
      if (data.length < limit) {
        setHasMore(false)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  useEffect(() => {
    function handleScroll() {
      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 100 &&
        !loadingRef.current &&
        hasMoreRef.current
      ) {
        fetchPosts()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [fetchPosts])

  return (
    <div>
      <UserPosts posts={posts} />
      {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}
      {!hasMore && <p style={{ textAlign: 'center' }}>No more posts</p>}
    </div>
  )
}
