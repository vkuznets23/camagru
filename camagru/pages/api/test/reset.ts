// /pages/api/test/reset.ts (или /api/test/reset.js)
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/utils/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //   console.log('NODE_ENV:', process.env.NODE_ENV)
  //   if (process.env.NODE_ENV !== 'test') {
  //     return res.status(403).json({ error: 'Not allowed' })
  //   }

  try {
    await prisma.user.deleteMany({})

    res.status(200).json({ status: 'ok' })
  } catch (err) {
    res.status(500).json({ error: 'DB reset failed', details: err })
  }
}
