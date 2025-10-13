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

  const followerIds = user.followers.map((f) => f.follower.id)

  const currentUserFollowing = await prisma.follower.findMany({
    where: {
      followerId: currentUserId,
      followingId: { in: followerIds },
    },
    select: {
      followingId: true,
    },
  })

  const followsYouRelations = await prisma.follower.findMany({
    where: {
      followerId: { in: followerIds },
      followingId: currentUserId,
    },
    select: {
      followerId: true,
    },
  })

  const followingSet = new Set(currentUserFollowing.map((f) => f.followingId))
  const followsYouSet = new Set(followsYouRelations.map((f) => f.followerId))

  const result = user.followers.map((f) => ({
    ...f.follower,
    isFollowing: followingSet.has(f.follower.id),
    followsYou: followsYouSet.has(f.follower.id),
  }))

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
