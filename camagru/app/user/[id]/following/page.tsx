import { prisma } from '@/utils/prisma'
import { notFound } from 'next/navigation'
import UserList from '@/components/UserList'

type Props = {
  params: { id: string }
}

export default async function FollowingPage({ params }: Props) {
  const userId = decodeURIComponent(params.id)

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      following: {
        select: {
          following: {
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

  const following = user.following.map((f) => f.following)

  return <UserList users={following} emptyMessage="No following yet." />
}
