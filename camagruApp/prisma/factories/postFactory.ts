import { faker } from '@faker-js/faker'

// model Post {
//   id        String    @id @default(cuid())
//   content   String?
//   image     String
//   userId    String
//   createdAt DateTime  @default(now())
//   blurDataURL String?
//   comments  Comment[]
//   likedBy   Like[]
//   user      User      @relation("UserPosts", fields: [userId], references: [id])
//   savedBy   User[]    @relation("SavedPosts")
// }

import sharp from 'sharp'
import fetch from 'node-fetch'

export async function getBlurDataURL(imageUrl: string) {
  const response = await fetch(imageUrl, { redirect: 'follow' })

  if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`)

  const contentType = response.headers.get('content-type')
  if (!contentType?.startsWith('image/')) {
    throw new Error(`URL did not return an image. Got: ${contentType}`)
  }

  const buffer = await response.buffer()

  const resized = await sharp(buffer)
    .resize(10, 10)
    .blur()
    .jpeg({ quality: 50 })
    .toBuffer()

  const base64 = resized.toString('base64')
  return `data:image/jpeg;base64,${base64}`
}

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY

export async function fetchUnsplashImage(query: string) {
  // Fallback to unique placeholder images if no API key
  if (!ACCESS_KEY) {
    const randomId = Math.floor(Math.random() * 1000) + 1
    return {
      full: `https://picsum.photos/800/800?random=${randomId}`,
      thumb: `https://picsum.photos/200/200?random=${randomId}`,
    }
  }

  try {
    // Extract base category from unique query
    const baseCategory = query.split('-')[0]
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${baseCategory}&client_id=${ACCESS_KEY}&count=1&w=800&h=800&fit=crop`
    )
    if (!response.ok) throw new Error(`Unsplash API error: ${response.status}`)

    const data = await response.json()
    return {
      full: data.urls.full,
      thumb: data.urls.thumb,
    }
  } catch (error) {
    console.warn(`Unsplash API failed, using unique placeholder: ${error}`)
    const randomId = Math.floor(Math.random() * 1000) + 1
    return {
      full: `https://picsum.photos/800/800?random=${randomId}`,
      thumb: `https://picsum.photos/200/200?random=${randomId}`,
    }
  }
}

// Remove cache to ensure unique images for each post
// const postImageCache: Record<string, { full: string; blurDataURL: string }> = {}

export async function postFactory(userId: string) {
  const categories = ['nature', 'people', 'animals', 'city', 'food', 'studying']
  const randomCategory =
    categories[Math.floor(Math.random() * categories.length)]

  // Fetch unique image for each post (no caching)
  // Add timestamp and random to ensure uniqueness
  const uniqueQuery = `${randomCategory}-${Date.now()}-${Math.random()}`

  // Small delay to avoid caching issues
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 100))

  const image = await fetchUnsplashImage(uniqueQuery)
  const blurDataURL = await getBlurDataURL(image.full)

  const imageData = { full: image.full, blurDataURL }

  return {
    content: faker.lorem.paragraph(),
    image: imageData.full,
    blurDataURL: imageData.blurDataURL,
    userId,
    createdAt: new Date(),
  }
}
