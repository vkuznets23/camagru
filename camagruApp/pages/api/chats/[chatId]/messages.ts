import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]'
import { prisma } from '@/utils/prisma'

// get messages
// create message

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
      const { page = '1', limit = '50' } = req.query
      const pageNum = parseInt(page as string)
      const limitNum = parseInt(limit as string)
      const skip = (pageNum - 1) * limitNum

      const messages = await prisma.message.findMany({
        where: {
          chatId,
          isDeleted: false,
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
            },
          },
          replyTo: {
            include: {
              sender: {
                select: {
                  id: true,
                  username: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limitNum,
      })

      // mark messages as read
      await prisma.message.updateMany({
        where: {
          chatId,
          receiverId: session.user.id,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      })

      res.status(200).json({
        messages: messages.reverse(), // return in chronological order
        hasMore: messages.length === limitNum,
        page: pageNum,
      })
    } catch (error) {
      console.error('Error fetching messages:', error)
      res.status(500).json({ error: 'Failed to fetch messages' })
    }
  } else if (req.method === 'POST') {
    try {
      const { content, type = 'TEXT', replyToId, imageUrl } = req.body

      if (!content && !imageUrl) {
        return res.status(400).json({ error: 'Message content is required' })
      }

      // create message
      const message = await prisma.message.create({
        data: {
          chatId,
          senderId: session.user.id,
          content: content || '',
          type,
          imageUrl: imageUrl || null,
          replyToId: replyToId || null,
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
            },
          },
          replyTo: {
            include: {
              sender: {
                select: {
                  id: true,
                  username: true,
                  name: true,
                },
              },
            },
          },
        },
      })

      // update last message time in chat
      await prisma.chat.update({
        where: { id: chatId },
        data: { lastMessageAt: new Date() },
      })

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
