import { prisma } from '@/utils/prisma'

export async function getUserFollowings(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      following: {
        select: {
          following: {
            select: {
              id: true,
              username: true,
              name: true,
              bio: true,
              image: true,
            },
          },
        },
      },
    },
  })

  if (!user) return null

  return user.following.map((f) => f.following)
}
