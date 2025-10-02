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
                  isOnline: true,
                  lastSeen: true,
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
      const formattedChats = chats.map((chat) => {
        const otherParticipants = chat.participants
          .filter((p) => p.userId !== session.user.id)
          .map((p) => p.user)

        return {
          id: chat.id,
          type: chat.type,
          name:
            chat.name ||
            (chat.type === 'DIRECT'
              ? otherParticipants[0]?.name || otherParticipants[0]?.username
              : null),
          image:
            chat.image ||
            (chat.type === 'DIRECT' ? otherParticipants[0]?.image : null),
          lastMessage: chat.messages[0] || null,
          participants: chat.participants.map((p) => ({
            id: p.user.id,
            username: p.user.username,
            name: p.user.name,
            image: p.user.image,
            isOnline: p.user.isOnline,
            lastSeen: p.user.lastSeen,
            role: p.role,
          })),
          unreadCount: 0, // TODO: Implement unread count
          updatedAt: chat.updatedAt,
        }
      })

      res.status(200).json({ chats: formattedChats })
    } catch (error) {
      console.error('Error fetching chats:', error)
      res.status(500).json({ error: 'Failed to fetch chats' })
    }
  } else if (req.method === 'POST') {
    try {
      const { type, participantIds, name, description } = req.body

      if (
        !participantIds ||
        !Array.isArray(participantIds) ||
        participantIds.length === 0
      ) {
        return res.status(400).json({ error: 'Participant IDs are required' })
      }

      // check if all participants exist
      const users = await prisma.user.findMany({
        where: {
          id: {
            in: [...participantIds, session.user.id],
          },
        },
      })

      if (users.length !== participantIds.length + 1) {
        return res.status(400).json({ error: 'Some participants not found' })
      }

      // create chat
      const chat = await prisma.chat.create({
        data: {
          type: type || 'DIRECT',
          name: name || null,
          description: description || null,
          participants: {
            create: [
              // add current user as admin
              {
                userId: session.user.id,
                role: 'ADMIN' as const,
              },
              // add other participants
              ...participantIds.map((id: string) => ({
                userId: id,
                role: 'MEMBER' as const,
              })),
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
