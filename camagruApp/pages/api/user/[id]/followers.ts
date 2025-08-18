import { prisma } from '@/utils/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

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

  return user.followers.map((f) => f.follower)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
  } = req

  if (method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const followers = await getUserFollowers(id as string)
    if (!followers) {
      return res.status(404).json({ error: 'User not found' })
    }
    return res.status(200).json(followers)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
