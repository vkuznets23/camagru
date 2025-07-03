import { prisma } from '@/utils/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

const MAX_COMMENT_LENGTH = 2200

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).end()

  const session = await getServerSession(req, res, authOptions)

  if (!session || !session.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { content, postId } = req.body

  if (!content || !postId) {
    return res.status(400).json({ error: 'Missing content or postId' })
  }

  if (content.trim().length > MAX_COMMENT_LENGTH) {
    return res.status(400).json({
      error: `Comment too long (max ${MAX_COMMENT_LENGTH} characters)`,
    })
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
      },
    })

    return res.status(201).json(comment)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Failed to create comment' })
  }
}
