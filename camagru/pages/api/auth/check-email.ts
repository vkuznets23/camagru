import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const email = (req.query.email as string)?.trim().toLowerCase()
  if (!email) {
    return res.status(400).json({ error: 'Email query is required' })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    return res.status(200).json({ available: !user })
  } catch (error) {
    console.error('Check email error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
