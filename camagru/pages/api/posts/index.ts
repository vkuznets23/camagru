import { prisma } from '@/utils/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET': {
      const userId = req.query.userId as string | undefined

      try {
        const posts = await prisma.post.findMany({
          include: {
            user: true,
            comments: true,
            likedBy: userId
              ? {
                  where: { id: userId },
                }
              : false,
          },
        })

        const postsWithLikeFlag = posts.map((post) => ({
          ...post,
          likedByCurrentUser: userId ? post.likedBy.length > 0 : false,
        }))

        return res.status(200).json(postsWithLikeFlag)
      } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Failed to fetch posts' })
      }
    }
    case 'POST': {
      const { content, image, userId } = req.body
      if (!userId) {
        return res.status(400).json({ error: 'Missing userId' })
      }

      if (!image) {
        return res.status(400).json({ error: 'Missing image' })
      }
      try {
        const post = await prisma.post.create({
          data: {
            content: content?.trim() || null,
            image: image,
            userId,
          },
        })
        return res.status(201).json(post)
      } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Failed to create post' })
      }
    }
    case 'DELETE': {
      const { postId } = req.query
      if (!postId || typeof postId !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid postId' })
      }

      try {
        await prisma.post.delete({
          where: { id: postId },
        })
        return res.status(204).end()
      } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Failed to delete post' })
      }
    }

    case 'PATCH': {
      const { postId } = req.query
      const { content } = req.body

      if (!postId || typeof postId !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid postId' })
      }

      try {
        const updatedPost = await prisma.post.update({
          where: { id: postId },
          data: { content: content?.trim() || null },
        })
        return res.status(200).json(updatedPost)
      } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Failed to update post' })
      }
    }
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
