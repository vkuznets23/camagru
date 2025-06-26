import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import { prisma } from '@/utils/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })

  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'Unauthorized' })

  const { userId } = req.body

  try {
    await prisma.follower.deleteMany({
      where: {
        followerId: session.user.id,
        followingId: userId,
      },
    })
    return res.status(200).json({ success: true })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Failed to unfollow' })
  }
}
