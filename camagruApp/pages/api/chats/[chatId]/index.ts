import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]'
import { prisma } from '@/utils/prisma'

// get chat info
// update chat
// delete chat

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { chatId } = req.query

  if (!chatId || typeof chatId !== 'string') {
    return res.status(400).json({ error: 'Chat ID is required' })
  }

  if (req.method === 'GET') {
    try {
      // get chat info
      const chat = await prisma.chat.findFirst({
        where: {
          id: chatId,
          participants: {
            some: {
              userId: session.user.id,
              isActive: true,
            },
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

      if (!chat) {
        return res.status(404).json({ error: 'Chat not found' })
      }

      res.status(200).json({ chat })
    } catch (error) {
      console.error('Error fetching chat:', error)
      res.status(500).json({ error: 'Failed to fetch chat' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { name, description, image } = req.body

      // check if user is a participant of the chat
      const participant = await prisma.chatParticipant.findFirst({
        where: {
          chatId,
          userId: session.user.id,
          isActive: true,
        },
      })

      if (!participant) {
        return res.status(403).json({ error: 'Access denied' })
      }

      // update chat
      const updatedChat = await prisma.chat.update({
        where: { id: chatId },
        data: {
          name: name || undefined,
          description: description || undefined,
          image: image || undefined,
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

      res.status(200).json({ chat: updatedChat })
    } catch (error) {
      console.error('Error updating chat:', error)
      res.status(500).json({ error: 'Failed to update chat' })
    }
  } else if (req.method === 'DELETE') {
    try {
      // check if user is a participant of the chat
      const participant = await prisma.chatParticipant.findFirst({
        where: {
          chatId,
          userId: session.user.id,
          isActive: true,
        },
      })

      if (!participant) {
        return res.status(403).json({ error: 'Access denied' })
      }

      // delete user from chat (mark as inactive)
      await prisma.chatParticipant.update({
        where: {
          id: participant.id,
        },
        data: {
          isActive: false,
          leftAt: new Date(),
        },
      })

      res.status(200).json({ message: 'Left chat successfully' })
    } catch (error) {
      console.error('Error leaving chat:', error)
      res.status(500).json({ error: 'Failed to leave chat' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    res.status(405).json({ error: 'Method not allowed' })
  }
}
