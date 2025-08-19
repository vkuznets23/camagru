import { prisma } from '@/utils/prisma'

export async function getUserFollowings(userId: string, currentUserId: string) {
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

  const result = await Promise.all(
    user.following.map(async (f) => {
      const isFollowing = !!(await prisma.follower.findFirst({
        where: {
          followerId: currentUserId,
          followingId: f.following.id,
        },
      }))
      return {
        ...f.following,
        isFollowing,
      }
    })
  )
  return result
}

import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]'

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

    const session = await getServerSession(req, res, authOptions)
    const currentUserId = session?.user?.id
    if (!currentUserId) return res.status(401).json({ error: 'Unauthorized' })

    const followings = await getUserFollowings(id, currentUserId)

    return res.status(200).json(followings ?? [])
  } catch (err) {
    console.error('Error in following API:', err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
