import { prisma } from '@/utils/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
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

  const { postId, content, image, saved } = req.body

  if (!postId) {
    return res.status(400).json({ error: 'Missing postId' })
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { savedBy: true, user: true },
    })

    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    if (post.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        ...(content !== undefined && { content }),
        ...(image !== undefined && { image }),
      },
      include: {
        savedBy: true,
        likedBy: true,
        comments: true,
        user: true,
      },
    })

    if (typeof saved === 'boolean') {
      if (saved) {
        await prisma.savedPost.create({
          data: {
            userId,
            postId,
          },
        })
      } else {
        await prisma.savedPost.deleteMany({
          where: {
            userId,
            postId,
          },
        })
      }
    }

    const postAfterSaveUpdate = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        savedBy: true,
        likedBy: true,
        comments: true,
        user: true,
      },
    })

    const savedByCurrentUser = postAfterSaveUpdate?.savedBy.some(
      (saved) => saved.id === userId
    )
    const likedByCurrentUser = postAfterSaveUpdate?.likedBy.some(
      (like) => like.userId === userId
    )
    const likesCount = postAfterSaveUpdate?.likedBy.length ?? 0

    return res.status(200).json({
      ...postAfterSaveUpdate,
      savedByCurrentUser,
      likedByCurrentUser,
      likesCount,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Failed to update post' })
  }
}
