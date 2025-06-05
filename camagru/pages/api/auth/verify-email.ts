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

  try {
    const { token } = req.query

    if (!token || typeof token !== 'string') {
      res.writeHead(302, {
        Location: '/auth/verify-request?error=Token missing',
      })
      res.end()
      return
    }

    const record = await prisma.emailVerificationToken.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!record) {
      res.writeHead(302, {
        Location: '/auth/verify-request?error=Invalid token',
      })
      res.end()
      return
    }

    if (record.expires < new Date()) {
      res.writeHead(302, {
        Location: '/auth/verify-request?error=Token expired',
      })
      res.end()
      return
    }

    await prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: new Date() },
    })

    await prisma.emailVerificationToken.delete({
      where: { token },
    })

    res.writeHead(302, {
      Location: '/auth/verify-request?success=true',
    })
    res.end()
  } catch (error) {
    console.error('Email verification error:', error)
    res.writeHead(302, {
      Location: '/auth/verify-request?error=Internal server error',
    })
    res.end()
  }
}
