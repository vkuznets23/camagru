import { prisma } from '@/utils/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

const MAX_COMMENT_LENGTH = 2200

// Validation functions
function validateCommentContent(content: string): string | null {
  if (!content) return 'Comment content is required'

  const trimmedContent = content.trim()
  if (!trimmedContent) return 'Comment cannot be empty'

  if (trimmedContent.length > MAX_COMMENT_LENGTH) {
    return `Comment too long (max ${MAX_COMMENT_LENGTH} characters)`
  }

  // Basic XSS protection - remove script tags and dangerous HTML
  const sanitizedContent = trimmedContent
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')

  if (sanitizedContent !== trimmedContent) {
    return 'Comment contains invalid characters'
  }

  return null
}

async function validatePostExists(postId: string): Promise<boolean> {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    })
    return !!post
  } catch {
    return false
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).end()

  const session = await getServerSession(req, res, authOptions)

  if (!session || !session.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { content, postId } = req.body

  // Validate required fields
  if (!content || !postId) {
    return res.status(400).json({ error: 'Missing content or postId' })
  }

  // Validate content
  const contentError = validateCommentContent(content)
  if (contentError) {
    return res.status(400).json({ error: contentError })
  }

  // Validate post exists
  const postExists = await validatePostExists(postId)
  if (!postExists) {
    return res.status(404).json({ error: 'Post not found' })
  }

  try {
    // Sanitize content
    const sanitizedContent = content.trim()

    const comment = await prisma.comment.create({
      data: {
        content: sanitizedContent,
        postId,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
      },
    })

    return res.status(201).json(comment)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Failed to create comment' })
  }
}
