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

  switch (req.method) {
    case 'GET': {
      try {
        const posts = await prisma.post.findMany({
          include: {
            user: true,
            comments: { include: { user: true } },
            likedBy: true,
          },
        })

        const formattedPosts = posts.map((post) => ({
          ...post,
          likesCount: post.likedBy.length,
          likedByCurrentUser: post.likedBy.some(
            (like) => like.userId === currentUserId
          ),
        }))

        return res.status(200).json(formattedPosts)
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
