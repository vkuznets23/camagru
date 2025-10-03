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

  if (req.method === 'GET') {
    try {
      // get all chats for user
      const chats = await prisma.chat.findMany({
        where: {
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
                },
              },
            },
          },
          messages: {
            take: 1,
            orderBy: {
              createdAt: 'desc',
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
            },
          },
        },
        orderBy: {
          lastMessageAt: 'desc',
        },
      })

      // format data for frontend
      const formattedChats = await Promise.all(
        chats.map(async (chat) => {
          const otherParticipants = chat.participants
            .filter((p) => p.userId !== session.user.id)
            .map((p) => p.user)

          // count unread messages per chat
          const unreadCount = await prisma.message.count({
            where: {
              chatId: chat.id,
              senderId: { not: session.user.id },
              isRead: false,
            },
          })

          return {
            id: chat.id,
            name:
              otherParticipants[0]?.name ||
              otherParticipants[0]?.username ||
              'Unknown User',
            image: otherParticipants[0]?.image || null,
            lastMessage: chat.messages[0] || null,
            participants: chat.participants.map((p) => ({
              id: p.user.id,
              name: p.user.name || p.user.username,
              image: p.user.image,
            })),
            unreadCount,
          }
        })
      )

      res.status(200).json({ chats: formattedChats })
    } catch (error) {
      console.error('Error fetching chats:', error)
      res.status(500).json({ error: 'Failed to fetch chats' })
    }
  } else if (req.method === 'POST') {
    try {
      const { participantId } = req.body

      if (!participantId) {
        return res.status(400).json({ error: 'Participant ID is required' })
      }

      // check if participant exists
      const user = await prisma.user.findUnique({
        where: { id: participantId },
      })

      if (!user) {
        return res.status(400).json({ error: 'Participant not found' })
      }

      // create direct chat
      const chat = await prisma.chat.create({
        data: {
          participants: {
            create: [
              {
                userId: session.user.id,
              },
              {
                userId: participantId,
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
                },
              },
            },
          },
        },
      })

      res.status(201).json({ chat })
    } catch (error) {
      console.error('Error creating chat:', error)
      res.status(500).json({ error: 'Failed to create chat' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).json({ error: 'Method not allowed' })
  }
}
