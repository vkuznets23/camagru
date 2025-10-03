import { NextApiRequest } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]'
import { prisma } from '@/utils/prisma'
import { NextApiResponseServerIO } from '../../socketio'

// get messages
// create message

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { chatId } = req.query

  if (!chatId || typeof chatId !== 'string') {
    return res.status(400).json({ error: 'Chat ID is required' })
  }

  // check if user is a participant of the chat
  const chatParticipant = await prisma.chatParticipant.findFirst({
    where: {
      chatId,
      userId: session.user.id,
      isActive: true,
    },
  })

  if (!chatParticipant) {
    return res.status(403).json({ error: 'Access denied' })
  }

  if (req.method === 'GET') {
    try {
      const messages = await prisma.message.findMany({
        where: {
          chatId,
        },
        select: {
          id: true,
          content: true,
          senderId: true,
          createdAt: true,
          sender: {
            select: {
              username: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      res.status(200).json({
        messages: messages.reverse(), // return in chronological order
      })
    } catch (error) {
      console.error('Error fetching messages:', error)
      res.status(500).json({ error: 'Failed to fetch messages' })
    }
  } else if (req.method === 'POST') {
    try {
      const { content } = req.body

      if (!content) {
        return res.status(400).json({ error: 'Message content is required' })
      }

      // create message
      const message = await prisma.message.create({
        data: {
          chatId,
          senderId: session.user.id,
          content,
        },
        select: {
          id: true,
          content: true,
          senderId: true,
          createdAt: true,
          sender: {
            select: {
              username: true,
              name: true,
              image: true,
            },
          },
        },
      })

      // Send WebSocket event for real-time updates
      if (res.socket.server.io) {
        res.socket.server.io.to(`chat-${chatId}`).emit('new-message', {
          id: message.id,
          chatId: chatId,
          content: message.content,
          senderId: message.senderId,
          createdAt: message.createdAt,
          sender: {
            name: message.sender.name,
            username: message.sender.username,
            image: message.sender.image,
          },
        })

        // Also emit a global event so other tabs (not joined to the room) can update unread badge
        res.socket.server.io.emit('new-message', {
          chatId: chatId,
          senderId: message.senderId,
        })
      }

      res.status(201).json({ message })
    } catch (error) {
      console.error('Error creating message:', error)
      res.status(500).json({ error: 'Failed to create message' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).json({ error: 'Method not allowed' })
  }
}
