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

  if (req.method !== 'GET') return res.status(405).end()

  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id
  if (!id) return res.status(400).json({ error: 'Missing user ID' })

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        name: true,
        bio: true,
        image: true,
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
          },
        },
        posts: {
          select: {
            id: true,
            content: true,
            image: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true,
              },
            },
            comments: {
              orderBy: { createdAt: 'desc' },
              include: {
                user: {
                  select: { username: true, image: true },
                },
              },
            },
            likedBy: true,
          },
        },
      },
    })

    if (!user) return res.status(404).json({ error: 'User not found' })

    const sanitizedPosts = (user.posts ?? []).map((post) => ({
      ...post,
      comments: Array.isArray(post.comments) ? post.comments : [],
      likesCount: post.likedBy.length,
      likedByCurrentUser: currentUserId
        ? post.likedBy.some((like) => like.userId === currentUserId)
        : false,
    }))

    return res.status(200).json({
      ...user,
      posts: sanitizedPosts,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}
