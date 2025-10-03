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

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get all chats where user is a participant
    const userChats = await prisma.chatParticipant.findMany({
      where: {
        userId: session.user.id,
        isActive: true,
      },
      select: {
        chatId: true,
      },
    })

    const chatIds = userChats.map((chat) => chat.chatId)

    if (chatIds.length === 0) {
      return res.status(200).json({ count: 0 })
    }

    // Count unread messages (messages not sent by current user and not read)
    const unreadCount = await prisma.message.count({
      where: {
        chatId: {
          in: chatIds,
        },
        senderId: {
          not: session.user.id,
        },
        isRead: false,
      },
    })

    res.status(200).json({ count: unreadCount })
  } catch (error) {
    console.error('Error fetching unread count:', error)
    res.status(500).json({ error: 'Failed to fetch unread count' })
  }
}
