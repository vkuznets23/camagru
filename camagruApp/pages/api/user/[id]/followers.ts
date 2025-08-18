import { prisma } from '@/utils/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { authOptions } from '../../auth/[...nextauth]'
import { getServerSession } from 'next-auth'

export async function getUserFollowers(userId: string, currentUserId: string) {
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

  const result = await Promise.all(
    user.followers.map(async (f) => {
      const isFollowing = !!(await prisma.follower.findFirst({
        where: {
          followerId: currentUserId,
          followingId: f.follower.id,
        },
      }))
      return {
        ...f.follower,
        isFollowing,
      }
    })
  )
  return result
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
    const session = await getServerSession(req, res, authOptions)
    const currentUserId = session?.user?.id
    if (!currentUserId) return res.status(401).json({ error: 'Unauthorized' })

    const followers = await getUserFollowers(id as string, currentUserId)
    if (!followers) {
      return res.status(404).json({ error: 'User not found' })
    }
    return res.status(200).json(followers)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
