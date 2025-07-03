import { notFound } from 'next/navigation'
import UserList from '@/components/UserList'
import { getUserFollowings } from '@/pages/api/user/[id]/following'

// get id from URL
export default async function FollowingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const followings = await getUserFollowings(id)
  if (!followings) return notFound()

  return <UserList users={followings} emptyMessage="No following yet." />
}
