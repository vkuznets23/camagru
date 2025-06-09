import { prisma } from '@/utils/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method !== 'GET') return res.status(405).end()

  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id
  if (!id) return res.status(400).json({ error: 'Missing user ID' })

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return res.status(404).json({ error: 'User not found' })

  res.status(200).json(user)
}
