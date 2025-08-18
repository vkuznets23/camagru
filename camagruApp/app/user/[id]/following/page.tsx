'use client'

import { use } from 'react'
import { useEffect, useState } from 'react'
import UserList, { type FollowerPreview } from '@/components/UserList'
import UserListSkeleton from '@/components/userpage/UserListSkeleton'

export default function FollowingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const [followings, setFollowings] = useState<FollowerPreview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFollowings = async () => {
      try {
        const res = await fetch(`/api/user/${id}/following`)
        if (res.ok) {
          const data = await res.json()
          setFollowings(data)
        }
      } catch (err) {
        console.error('Error fetching followings', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFollowings()
  }, [id])

  const handleUnfollow = async (userId: string) => {
    try {
      const res = await fetch('/api/unfollow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      if (res.ok) {
        setFollowings((prev) => prev.filter((u) => u.id !== userId))
      } else {
        console.error('Failed to unfollow')
      }
    } catch (err) {
      console.error('Error unfollowing', err)
    }
  }

  if (loading) return <UserListSkeleton />
  if (!followings || followings.length === 0)
    return <UserList users={followings} emptyMessage="No following yet." />

  return (
    <UserList
      users={followings}
      emptyMessage="No following yet."
      onToggleFollow={handleUnfollow}
    />
  )
}
