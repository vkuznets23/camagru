import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import { prisma } from '@/utils/prisma'

type PrismaError = {
  code?: string
  meta?: unknown
}

function validateUserId(userId: unknown): string | null {
  if (!userId || typeof userId !== 'string') {
    return null
  }
  const trimmed = userId.trim()
  return trimmed === '' ? null : trimmed
}

function validateSession(session: unknown): string | null {
  if (
    !session ||
    typeof session !== 'object' ||
    !('user' in session) ||
    !session.user ||
    typeof session.user !== 'object' ||
    !('id' in session.user) ||
    typeof session.user.id !== 'string'
  ) {
    return null
  }
  return session.user.id
}

function isSelfFollow(followerId: string, followingId: string): boolean {
  return followerId === followingId
}

function handlePrismaError(err: unknown, res: NextApiResponse): boolean {
  const prismaError = err as PrismaError

  if (!prismaError.code) {
    return false
  }

  switch (prismaError.code) {
    // Unique constraint violation -> (followerId, followingId) pair is already exists
    // race condition protection
    case 'P2002':
      res.status(200).json({ success: true, message: 'Already following' })
      return true

    // Foreign key constraint violation -> user not found
    case 'P2003': {
      const meta = prismaError.meta as { field_name?: string } | undefined
      if (meta?.field_name?.includes('followingId')) {
        res.status(404).json({ error: 'User not found' })
      } else {
        res.status(500).json({ error: 'Database constraint violation' })
      }
      return true
    }

    default:
      if (prismaError.code.startsWith('P')) {
        // Other Prisma errors
        console.error('Prisma error:', prismaError.code, prismaError.meta, err)
        res.status(500).json({
          error: 'Database error occurred',
          code: prismaError.code,
        })
        return true
      }
      return false
  }
}

async function createFollowRelation(
  followerId: string,
  followingId: string,
): Promise<void> {
  await prisma.follower.create({
    data: {
      followerId,
      followingId,
    },
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const session = await getServerSession(req, res, authOptions)
  const followerId = validateSession(session)
  if (!followerId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const followingId = validateUserId(req.body.userId)
  if (!followingId) {
    return res.status(400).json({ error: 'Invalid userId' })
  }

  if (isSelfFollow(followerId, followingId)) {
    return res.status(400).json({ error: 'Cannot follow yourself' })
  }

  try {
    const [targetUser, existingFollow] = await Promise.all([
      prisma.user.findUnique({
        where: { id: followingId },
        select: { id: true },
      }),
      prisma.follower.findUnique({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      }),
    ])

    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (existingFollow) {
      return res
        .status(200)
        .json({ success: true, message: 'Already following' })
    }

    await createFollowRelation(followerId, followingId)
    return res.status(200).json({ success: true })
  } catch (err: unknown) {
    if (handlePrismaError(err, res)) {
      return
    }

    console.error('Follow error:', err)
    return res.status(500).json({ error: 'Failed to follow' })
  }
}
