import { prisma } from '@/utils/prisma'

export async function getUserFollowers(userId: string) {
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

  if (!user) return null

  return user.followers.map((f) => f.follower)
}
