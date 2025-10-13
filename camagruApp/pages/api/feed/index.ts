import { prisma } from '@/utils/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  const currentUserId = session?.user?.id

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    const { skip = '0', limit = '12' } = req.query
    const skipNum = Math.max(parseInt(skip as string, 10) || 0, 0)
    const limitNum = Math.min(
      Math.max(parseInt(limit as string, 10) || 12, 1),
      50
    )

    const posts = await prisma.post.findMany({
      skip: skipNum,
      take: limitNum,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likedBy: true,
          },
        },
      },
    })

    const postIds = posts.map((p) => p.id)

    const userLikes = currentUserId
      ? await prisma.like.findMany({
          where: {
            userId: currentUserId,
            postId: { in: postIds },
          },
          select: {
            postId: true,
          },
        })
      : []

    const likedPostIds = new Set(userLikes.map((like) => like.postId))

    const formattedPosts = posts.map((post) => ({
      ...post,
      comments: [],
      likedBy: [],
      likesCount: post._count.likedBy,
      commentsCount: post._count.comments,
      likedByCurrentUser: likedPostIds.has(post.id),
    }))

    return res.status(200).json(formattedPosts)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Failed to fetch feed posts' })
  }
}
