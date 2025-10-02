import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { prisma } from '@/utils/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'POST') {
    try {
      const { userId } = req.body

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' })
      }

      if (userId === session.user.id) {
        return res
          .status(400)
          .json({ error: 'Cannot create chat with yourself' })
      }

      // check if user exists
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, username: true, name: true, image: true },
      })

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      // find existing direct chat between users
      const existingChat = await prisma.chat.findFirst({
        where: {
          participants: {
            every: {
              userId: {
                in: [session.user.id, userId],
              },
            },
          },
          AND: [
            {
              participants: {
                some: {
                  userId: session.user.id,
                  isActive: true,
                },
              },
            },
            {
              participants: {
                some: {
                  userId: userId,
                  isActive: true,
                },
              },
            },
          ],
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  name: true,
                  image: true,
                  isOnline: true,
                  lastSeen: true,
                },
              },
            },
          },
        },
      })

      if (existingChat) {
        return res.status(200).json({ chat: existingChat })
      }

      // create new direct chat
      const newChat = await prisma.chat.create({
        data: {
          participants: {
            create: [
              {
                userId: session.user.id,
              },
              {
                userId: userId,
              },
            ],
          },
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  name: true,
                  image: true,
                  isOnline: true,
                  lastSeen: true,
                },
              },
            },
          },
        },
      })

      res.status(201).json({ chat: newChat })
    } catch (error) {
      console.error('Error creating/finding direct chat:', error)
      res.status(500).json({ error: 'Failed to create/find direct chat' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({ error: 'Method not allowed' })
  }
}
