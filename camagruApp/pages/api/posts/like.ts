import { prisma } from '@/utils/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', ['PATCH'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const session = await getServerSession(req, res, authOptions)
  const userId = session?.user?.id

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { postId } = req.body

  if (!postId) {
    return res.status(400).json({ error: 'Missing postId' })
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { likedBy: true },
    })

    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    const existingLike = post.likedBy.find((like) => like.userId === userId)

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      })
    } else {
      const likeExists = await prisma.like.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      })

      if (!likeExists) {
        await prisma.like.create({
          data: {
            userId,
            postId,
          },
        })
      }
    }

    const updatedPost = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        likedBy: true,
        user: true,
        comments: true,
      },
    })

    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found after update' })
    }

    const likedByCurrentUser = updatedPost.likedBy.some(
      (like) => like.userId === userId,
    )
    const likesCount = updatedPost.likedBy.length

    return res
      .status(200)
      .json({ ...updatedPost, likedByCurrentUser, likesCount })
  } catch (error: unknown) {
    const prismaError = error as { code?: string }

    if (prismaError.code === 'P2002' && postId && userId) {
      try {
        const updatedPost = await prisma.post.findUnique({
          where: { id: postId },
          include: {
            likedBy: true,
            user: true,
            comments: true,
          },
        })

        if (!updatedPost) {
          return res.status(404).json({ error: 'Post not found' })
        }

        const likedByCurrentUser = updatedPost.likedBy.some(
          (like) => like.userId === userId,
        )
        const likesCount = updatedPost.likedBy.length

        return res
          .status(200)
          .json({ ...updatedPost, likedByCurrentUser, likesCount })
      } catch (reloadError) {
        console.error('Error reloading post after race condition:', reloadError)
        return res.status(500).json({ error: 'Failed to toggle like' })
      }
    }

    console.error('Like error:', error)
    return res.status(500).json({ error: 'Failed to toggle like' })
  }
}
