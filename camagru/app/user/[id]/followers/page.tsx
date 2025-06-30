import { prisma } from '@/utils/prisma'
import { notFound } from 'next/navigation'
import UserList from '@/components/UserList'

type Props = {
  params: { id: string }
}

export default async function FollowersPage({ params }: Props) {
  const userId = params.id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      followers: {
        select: {
          follower: {
            select: {
              id: true,
              username: true,
              image: true,
            },
          },
        },
      },
    },
  })

  if (!user) return notFound()

  const followers = user.followers.map((f) => f.follower)

  return <UserList users={followers} emptyMessage="No followers yet." />
}
