import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/utils/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const unverifiedUsers = await prisma.user.findMany({
      where: { emailVerified: null },
    })

    for (const user of unverifiedUsers) {
      await prisma.emailVerificationToken.deleteMany({
        where: { userId: user.id },
      })
      await prisma.user.delete({ where: { id: user.id } })
    }

    return res.status(200).json({ deleted: unverifiedUsers.length })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
