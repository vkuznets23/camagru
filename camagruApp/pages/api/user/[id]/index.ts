import { prisma } from '@/utils/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  const currentUserId = session?.user?.id

  if (!currentUserId) return res.status(401).json({ error: 'Unauthorized' })

  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id
  if (!id) return res.status(400).json({ error: 'Missing user ID' })

  try {
    if (req.method === 'GET') {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          username: true,
          name: true,
          bio: true,
          image: true,
          emailVerified: true,
          _count: {
            select: { posts: true, followers: true, following: true },
          },
          posts: {
            select: {
              id: true,
              content: true,
              image: true,
              createdAt: true,
              blurDataURL: true,
              userId: true,
              user: {
                select: { id: true, username: true, name: true, image: true },
              },
              _count: {
                select: {
                  comments: true,
                  likedBy: true,
                  savedBy: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
          savedPosts: {
            select: {
              id: true,
              content: true,
              image: true,
              createdAt: true,
              blurDataURL: true,
              userId: true,
              user: {
                select: { id: true, username: true, name: true, image: true },
              },
              _count: {
                select: {
                  comments: true,
                  likedBy: true,
                  savedBy: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      })

      if (!user || !user.emailVerified)
        return res.status(404).json({ error: 'User not found' })

      const allPostIds = [
        ...user.posts.map((p) => p.id),
        ...user.savedPosts.map((p) => p.id),
      ]

      const [userLikes, userSaves] = await Promise.all([
        prisma.like.findMany({
          where: {
            userId: currentUserId,
            postId: { in: allPostIds },
          },
          select: { postId: true },
        }),
        prisma.user.findUnique({
          where: { id: currentUserId },
          select: {
            savedPosts: {
              where: { id: { in: allPostIds } },
              select: { id: true },
            },
          },
        }),
      ])

      const likedPostIds = new Set(userLikes.map((like) => like.postId))
      const savedPostIds = new Set(
        userSaves?.savedPosts.map((post) => post.id) || []
      )

      const sanitizedPosts = user.posts.map((post) => ({
        ...post,
        comments: [],
        likedBy: [],
        savedBy: [],
        likesCount: post._count.likedBy,
        commentsCount: post._count.comments,
        likedByCurrentUser: likedPostIds.has(post.id),
        savedByCurrentUser: savedPostIds.has(post.id),
      }))

      const sanitizedSavedPosts = user.savedPosts.map((post) => ({
        ...post,
        comments: [],
        likedBy: [],
        savedBy: [],
        likesCount: post._count.likedBy,
        commentsCount: post._count.comments,
        likedByCurrentUser: likedPostIds.has(post.id),
        savedByCurrentUser: savedPostIds.has(post.id),
      }))

      return res.status(200).json({
        ...user,
        posts: sanitizedPosts,
        savedPosts: sanitizedSavedPosts,
      })
    }

    if (req.method === 'DELETE') {
      const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id
      if (!id) return res.status(400).json({ error: 'Missing user ID' })

      try {
        await prisma.like.deleteMany({ where: { userId: id } })
        await prisma.comment.deleteMany({ where: { userId: id } })
        await prisma.follower.deleteMany({
          where: { OR: [{ followerId: id }, { followingId: id }] },
        })
        await prisma.emailVerificationToken.deleteMany({
          where: { userId: id },
        })
        await prisma.session.deleteMany({ where: { userId: id } })
        await prisma.post.deleteMany({ where: { userId: id } })
        await prisma.user.delete({ where: { id } })

        return res.status(200).json({ message: 'User deleted successfully' })
      } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Server error' })
      }
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}
