import { prisma } from '@/utils/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { commentId } = req.query

  if (typeof commentId !== 'string') {
    return res.status(400).json({ error: 'Invalid comment ID' })
  }

  const session = await getServerSession(req, res, authOptions)

  if (!session || !session.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'DELETE') {
    try {
      // check u made that comment
      const existingComment = await prisma.comment.findUnique({
        where: { id: commentId },
        include: {
          post: {
            select: { userId: true },
          },
        },
      })

      if (!existingComment) {
        return res.status(404).json({ error: 'Comment not found' })
      }

      const isCommentOwner = existingComment.userId === session.user.id
      const isPostOwner = existingComment.post.userId === session.user.id

      if (!isCommentOwner && !isPostOwner) {
        return res
          .status(403)
          .json({ error: 'Forbidden: not allowed to delete' })
      }

      await prisma.comment.delete({
        where: { id: commentId },
      })

      return res.status(200).json({ success: true })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Failed to delete comment' })
    }
  }

  return res.status(405).end()
}
