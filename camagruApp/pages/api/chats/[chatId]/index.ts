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
            where: {
              isActive: true,
            },
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      })

      if (!chat) {
        return res.status(404).json({ error: 'Chat not found' })
      }

      // Format data for frontend
      const otherParticipants = chat.participants
        .filter((p) => p.userId !== session.user.id)
        .map((p) => p.user)

      // count unread messages for this chat
      const unreadCount = await prisma.message.count({
        where: {
          chatId,
          senderId: { not: session.user.id },
          isRead: false,
        },
      })

      const formattedChat = {
        id: chat.id,
        name:
          otherParticipants[0]?.name ||
          otherParticipants[0]?.username ||
          'Unknown User',
        image: otherParticipants[0]?.image || null,
        participants: chat.participants.map((p) => ({
          id: p.user.id,
          name: p.user.name || p.user.username,
          image: p.user.image,
        })),
        unreadCount,
      }

      res.status(200).json({ chat: formattedChat })
    } catch (error) {
      console.error('Error fetching chat:', error)
      res.status(500).json({ error: 'Failed to fetch chat' })
    }
  } else if (req.method === 'PUT') {
    try {
      // No body parameters needed for chat update

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

      // update chat (only update lastMessageAt for now)
      const updatedChat = await prisma.chat.update({
        where: { id: chatId },
        data: {
          lastMessageAt: new Date(),
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
