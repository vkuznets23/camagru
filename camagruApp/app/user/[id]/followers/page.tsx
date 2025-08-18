// import UserList from '@/components/UserList'
// import { getUserFollowers } from '@/pages/api/user/[id]/followers'
// import { notFound } from 'next/navigation'

// export default async function FollowersPage({
//   params,
// }: {
//   params: Promise<{ id: string }>
// }) {
//   const { id } = await params
//   const followers = await getUserFollowers(id)
//   if (!followers) return notFound()

//   return <UserList users={followers} emptyMessage="No followers yet." />
// }

'use client'

import { use, useEffect, useState } from 'react'
import UserList, { FollowerPreview } from '@/components/UserList'
import UserListSkeleton from '@/components/userpage/UserListSkeleton'

export default function FollowersPageClient({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const [followers, setFollowers] = useState<FollowerPreview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFollowings = async () => {
      try {
        const res = await fetch(`/api/user/${id}/followers`)
        if (res.ok) {
          const data = await res.json()
          setFollowers(data)
        }
      } catch (err) {
        console.error('Error fetching followings', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFollowings()
  }, [id])

  const toggleFollow = async (userId: string) => {
    const target = followers.find((u) => u.id === userId)
    if (!target) return

    try {
      if (target.isFollowing) {
        await fetch('/api/unfollow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        })
      } else {
        await fetch('/api/follow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        })
      }

      setFollowers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, isFollowing: !u.isFollowing } : u
        )
      )
    } catch (err) {
      console.error(err)
    }
  }
  if (loading) return <UserListSkeleton />

  return (
    <UserList
      users={followers}
      emptyMessage="No followers yet."
      onToggleFollow={(userId) => {
        const user = followers.find((u) => u.id === userId)
        if (!user?.followsYou) toggleFollow(userId)
      }}
    />
  )
}
