import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { prisma } from '@/utils/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET')
    return res.status(405).json({ error: 'Method Not Allowed' })

  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'Unauthorized' })

  const userId = req.query.id as string
  const viewerId = session.user.id

  if (!userId || userId === viewerId) {
    return res.status(400).json({ error: 'Invalid user ID' })
  }

  try {
    const follow = await prisma.follower.findFirst({
      where: {
        followerId: viewerId,
        followingId: userId,
      },
    })

    res.status(200).json({ following: !!follow })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to check following status' })
  }
}
