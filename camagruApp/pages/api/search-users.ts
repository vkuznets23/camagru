import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/utils/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { query } = req.query

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid query' })
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: query,
          mode: 'insensitive',
        },
        emailVerified: {
          not: null,
        },
      },
      select: {
        id: true,
        username: true,
        image: true,
        bio: true,
      },
    })

    return res.status(200).json({ users })
  } catch (error) {
    console.error('Search error:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
