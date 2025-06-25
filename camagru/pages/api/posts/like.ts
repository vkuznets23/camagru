import { prisma } from '@/utils/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', ['PATCH'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const { postId, userId } = req.body

  if (!postId || !userId) {
    return res.status(400).json({ error: 'Missing postId or userId' })
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { likedBy: true },
    })

    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    const isLiked = post.likedBy.some((user) => user.id === userId)

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        likedBy: isLiked
          ? { disconnect: { id: userId } }
          : { connect: { id: userId } },
      },
      include: { likedBy: true },
    })

    return res.status(200).json(updatedPost)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Failed to toggle like' })
  }
}
