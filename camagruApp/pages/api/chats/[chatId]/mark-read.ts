import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]'
import { prisma } from '@/utils/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { chatId } = req.query

  if (!chatId || typeof chatId !== 'string') {
    return res.status(400).json({ error: 'Chat ID is required' })
  }

  try {
    // Check if user is a participant in this chat
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

    // Mark all messages in this chat as read for the current user
    await prisma.message.updateMany({
      where: {
        chatId,
        senderId: {
          not: session.user.id,
        },
        isRead: false,
      },
      data: {
        isRead: true,
      },
    })

    res.status(200).json({ message: 'Messages marked as read' })
  } catch (error) {
    console.error('Error marking messages as read:', error)
    res.status(500).json({ error: 'Failed to mark messages as read' })
  }
}
