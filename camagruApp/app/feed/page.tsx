'use client'

import { type Post } from '@/types/post'
import { useEffect, useState, useCallback, useRef } from 'react'
import styles from '@/styles/Profile.module.css'
import PostSkeleton from '@/components/posts/PostsSceleton'
import FeedPosts from '@/components/posts/Feed'
import { useUser } from '@/context/userContext'

export default function FeedPage() {
  const { user, posts, setPosts } = useUser()
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
  }, [setPosts])

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

  const initialLoading = posts.length === 0 && loading

  if (!user) return null

  return (
    <div>
      {initialLoading ? (
        <div className={styles.posts}>
          <div className={styles.postsContainer}>
            {[...Array(12)].map((_, i) => (
              <PostSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : (
        <FeedPosts posts={posts} />
      )}
      {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}
      {!hasMore && <p className={styles.notingToSee}>Nothing more to see</p>}
    </div>
  )
}
