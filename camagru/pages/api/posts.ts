import { prisma } from '@/utils/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).end()

  const { content, image, userId } = req.body

  if (!content || !userId) {
    return res.status(400).json({ error: 'Missing content or userId' })
  }

  try {
    const post = await prisma.post.create({
      data: {
        content,
        image: image || null,
        userId,
      },
    })
    return res.status(201).json(post)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Failed to create post' })
  }
}
