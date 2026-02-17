import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/utils/prisma'
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

  const { postId, save } = req.body

  if (!postId || typeof save !== 'boolean') {
    return res.status(400).json({ error: 'Missing or invalid postId/save' })
  }

  try {
    const postExists = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    })
    if (!postExists) return res.status(404).json({ error: 'Post not found' })

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })
    if (!user) return res.status(404).json({ error: 'User not found' })

    await prisma.user.update({
      where: { id: user.id },
      data: {
        savedPosts: save
          ? { connect: { id: postId } }
          : { disconnect: { id: postId } },
      },
    })

    const updatedPost = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: true,
        comments: { include: { user: true } },
        likedBy: true,
        savedBy: true,
      },
    })

    if (!updatedPost) return res.status(404).json({ error: 'Post not found' })

    const formattedPost = {
      ...updatedPost,
      likesCount: updatedPost.likedBy.length,
      likedByCurrentUser: updatedPost.likedBy.some(
        (like) => like.userId === user.id,
      ),
      savedByCurrentUser: updatedPost.savedBy.some((u) => u.id === user.id),
    }

    return res.status(200).json(formattedPost)
  } catch (err: unknown) {
    const prismaError = err as { code?: string }

    if (prismaError.code === 'P2002' && postId && userId) {
      try {
        const updatedPost = await prisma.post.findUnique({
          where: { id: postId },
          include: {
            user: true,
            comments: { include: { user: true } },
            likedBy: true,
            savedBy: true,
          },
        })

        if (!updatedPost) {
          return res.status(404).json({ error: 'Post not found' })
        }

        const formattedPost = {
          ...updatedPost,
          likesCount: updatedPost.likedBy.length,
          likedByCurrentUser: updatedPost.likedBy.some(
            (like) => like.userId === userId,
          ),
          savedByCurrentUser: updatedPost.savedBy.some((u) => u.id === userId),
        }

        return res.status(200).json(formattedPost)
      } catch (reloadError) {
        console.error('Error reloading post after race condition:', reloadError)
        return res.status(500).json({ error: 'Internal server error' })
      }
    }

    console.error('Save error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
