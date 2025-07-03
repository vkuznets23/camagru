import { prisma } from '@/utils/prisma'
import { notFound } from 'next/navigation'
import UserList from '@/components/UserList'
import { getUserFollowings } from '@/pages/api/user/[id]/following'

type Props = {
  params: { id: string }
}

export default async function FollowingPage({ params }: Props) {
  const { id } = await params
  const followings = await getUserFollowings(id)
  if (!followings) return notFound()

  return <UserList users={followings} emptyMessage="No following yet." />
}
