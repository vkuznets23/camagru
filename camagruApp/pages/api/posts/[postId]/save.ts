// import { prisma } from '@/utils/prisma'
// import type { NextApiRequest, NextApiResponse } from 'next'
// import { getServerSession } from 'next-auth/next'
// import { authOptions } from '../../auth/[...nextauth]'

// async function updateSavedPosts(
//   userId: string,
//   postId: string,
//   action: 'connect' | 'disconnect'
// ) {
//   await prisma.user.update({
//     where: { id: userId },
//     data: {
//       savedPosts: {
//         [action]: { id: postId },
//       },
//     },
//   })

//   const updatedPost = await prisma.post.findUnique({
//     where: { id: postId },
//     include: {
//       savedBy: true,
//       likedBy: true,
//       user: true,
//       comments: { include: { user: true } },
//     },
//   })

//   if (!updatedPost) {
//     throw new Error('Post not found')
//   }

//   const savedByCurrentUser = updatedPost.savedBy.some(
//     (user) => user.id === userId
//   )

//   return { ...updatedPost, savedByCurrentUser }
// }

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const session = await getServerSession(req, res, authOptions)
//   if (!session?.user?.id) {
//     return res.status(401).json({ error: 'Unauthorized' })
//   }
//   const userId = session.user.id
//   const { postId } = req.query
//   if (!postId || typeof postId !== 'string') {
//     return res.status(400).json({ error: 'Invalid postId' })
//   }

//   try {
//     if (req.method === 'POST') {
//       const updatedPost = await updateSavedPosts(userId, postId, 'connect')
//       return res.status(200).json(updatedPost)
//     } else if (req.method === 'DELETE') {
//       const updatedPost = await updateSavedPosts(userId, postId, 'disconnect')
//       return res.status(200).json(updatedPost)
//     } else {
//       res.setHeader('Allow', ['POST', 'DELETE'])
//       return res.status(405).end(`Method ${req.method} Not Allowed`)
//     }
//   } catch (error) {
//     console.error(error)
//     if (error instanceof Error && error.message === 'Post not found') {
//       return res.status(404).json({ error: error.message })
//     }
//     return res.status(500).json({ error: 'Something went wrong' })
//   }
// }

// /pages/api/posts/[postId]/save.ts

import { prisma } from '@/utils/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.id) return res.status(401).json({ error: 'Unauthorized' })

  const { postId } = req.query
  if (!postId || typeof postId !== 'string')
    return res.status(400).json({ error: 'Invalid postId' })

  if (req.method !== 'PATCH') {
    res.setHeader('Allow', ['PATCH'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const userId = session.user.id

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { savedBy: true },
    })

    if (!post) return res.status(404).json({ error: 'Post not found' })

    const isSaved = post.savedBy.some((user) => user.id === userId)

    if (isSaved) {
      await prisma.post.update({
        where: { id: postId },
        data: { savedBy: { disconnect: { id: userId } } },
      })
    } else {
      await prisma.post.update({
        where: { id: postId },
        data: { savedBy: { connect: { id: userId } } },
      })
    }

    const updatedPost = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        likedBy: true,
        savedBy: true,
        user: true,
        comments: { include: { user: true } },
      },
    })

    if (!updatedPost)
      return res.status(404).json({ error: 'Post not found after update' })

    const savedByCurrentUser = updatedPost.savedBy.some(
      (user) => user.id === userId
    )

    return res.status(200).json({ ...updatedPost, savedByCurrentUser })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Failed to toggle save' })
  }
}
