import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { prisma } from '@/utils/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const session = await getServerSession(req, res, authOptions)

  if (!session || !session.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { name, bio, image, action } = req.body

  console.log('Received data:', { name, bio, image, userId: session.user.id })

  try {
    if (action === 'delete-avatar') {
      const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: {
          image: null,
        },
      })
      return res
        .status(200)
        .json({ message: 'Avatar deleted', user: updatedUser })
    }
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        bio,
        image,
      },
    })

    return res.status(200).json({ message: 'User updated', user: updatedUser })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
