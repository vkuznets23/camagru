import { prisma } from '@/utils/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { getBlurDataURL } from '@/utils/blurImage'

// Constants
const MAX_CONTENT_LENGTH = 2200
const MAX_IMAGE_URL_LENGTH = 2048

// Validation functions
function validateContent(content: string | undefined): string | null {
  if (!content) return null // Content is optional

  const trimmedContent = content.trim()
  if (trimmedContent.length > MAX_CONTENT_LENGTH) {
    return `Content too long (max ${MAX_CONTENT_LENGTH} characters)`
  }

  // Basic XSS protection - remove script tags and dangerous HTML
  const sanitizedContent = trimmedContent
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')

  return sanitizedContent !== trimmedContent
    ? 'Content contains invalid characters'
    : null
}

function validateImageUrl(imageUrl: string): string | null {
  if (!imageUrl) return 'Image URL is required'

  if (imageUrl.length > MAX_IMAGE_URL_LENGTH) {
    return 'Image URL too long'
  }

  // Basic URL validation
  try {
    const url = new URL(imageUrl)
    if (!['http:', 'https:'].includes(url.protocol)) {
      return 'Invalid image URL protocol'
    }

    // Check if it's a valid image URL (basic check)
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    const hasValidExtension = validExtensions.some((ext) =>
      url.pathname.toLowerCase().includes(ext)
    )

    if (!hasValidExtension && !url.hostname.includes('cloudinary.com')) {
      return 'Invalid image format'
    }
  } catch {
    return 'Invalid image URL format'
  }

  return null
}

async function checkPostOwnership(
  postId: string,
  userId: string
): Promise<boolean> {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    })
    return post?.userId === userId
  } catch {
    return false
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  const currentUserId = session?.user?.id

  switch (req.method) {
    case 'GET': {
      try {
        const posts = await prisma.post.findMany({
          select: {
            id: true,
            content: true,
            image: true,
            blurDataURL: true,
            createdAt: true,
            user: true,
            comments: { include: { user: true } },
            likedBy: true,
            savedBy: true,
          },
        })

        const formattedPosts = posts.map((post) => ({
          ...post,
          likesCount: post.likedBy.length,
          likedByCurrentUser: post.likedBy.some(
            (like) => like.userId === currentUserId
          ),
          savedByCurrentUser: post.savedBy.some(
            (user) => user.id === currentUserId
          ),
        }))

        return res.status(200).json(formattedPosts)
      } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Failed to fetch posts' })
      }
    }
    case 'POST': {
      const { content, image, userId } = req.body

      // Validate required fields
      if (!userId) {
        return res.status(400).json({ error: 'Missing userId' })
      }

      if (userId !== currentUserId) {
        return res.status(403).json({ error: 'Forbidden' })
      }

      // Validate content
      const contentError = validateContent(content)
      if (contentError) {
        return res.status(400).json({ error: contentError })
      }

      // Validate image URL
      const imageError = validateImageUrl(image)
      if (imageError) {
        return res.status(400).json({ error: imageError })
      }

      try {
        const blurDataURL = await getBlurDataURL(image)

        // Sanitize content
        const sanitizedContent = content?.trim() || null

        const post = await prisma.post.create({
          data: {
            content: sanitizedContent,
            image: image,
            blurDataURL,
            userId,
          },
        })
        return res.status(201).json(post)
      } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Failed to create post' })
      }
    }
    case 'DELETE': {
      const { postId } = req.query
      if (!postId || typeof postId !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid postId' })
      }

      if (!currentUserId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      // Check if user owns the post
      const isOwner = await checkPostOwnership(postId, currentUserId)
      if (!isOwner) {
        return res
          .status(403)
          .json({ error: 'Forbidden - You can only delete your own posts' })
      }

      try {
        await prisma.post.delete({
          where: { id: postId },
        })
        return res.status(204).end()
      } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Failed to delete post' })
      }
    }

    case 'PATCH': {
      const { postId } = req.query
      const { content } = req.body

      if (!postId || typeof postId !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid postId' })
      }

      if (!currentUserId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      // Check if user owns the post
      const isOwner = await checkPostOwnership(postId, currentUserId)
      if (!isOwner) {
        return res
          .status(403)
          .json({ error: 'Forbidden - You can only update your own posts' })
      }

      // Validate content
      const contentError = validateContent(content)
      if (contentError) {
        return res.status(400).json({ error: contentError })
      }

      try {
        // Sanitize content
        const sanitizedContent = content?.trim() || null

        const updatedPost = await prisma.post.update({
          where: { id: postId },
          data: { content: sanitizedContent },
        })
        return res.status(200).json(updatedPost)
      } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Failed to update post' })
      }
    }
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
