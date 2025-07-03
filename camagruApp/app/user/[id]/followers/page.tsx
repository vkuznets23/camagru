import UserList from '@/components/UserList'
import { getUserFollowers } from '@/pages/api/user/[id]/followers'
import { notFound } from 'next/navigation'

export default async function FollowersPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const followers = await getUserFollowers(id)
  if (!followers) return notFound()

  return <UserList users={followers} emptyMessage="No followers yet." />
}
