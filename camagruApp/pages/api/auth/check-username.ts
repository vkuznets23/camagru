import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/utils/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const username = (req.query.username as string)?.trim()
  if (!username) {
    return res.status(400).json({ error: 'Username query is required' })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    })

    return res.status(200).json({ available: !user })
  } catch (error) {
    console.error('Check username error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
