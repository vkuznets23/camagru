import { prisma } from '@/utils/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') return res.status(405).end()

  const { postId } = req.query

  if (!postId || typeof postId !== 'string') {
    return res.status(400).json({ error: 'Invalid post ID' })
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            username: true,
            image: true,
          },
        },
      },
    })

    return res.status(200).json(comments)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Failed to load comments' })
  }
}
