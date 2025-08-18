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

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid user id' })
    }

    const followings = await getUserFollowings(id)

    return res.status(200).json(followings ?? [])
  } catch (err) {
    console.error('Error in following API:', err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
