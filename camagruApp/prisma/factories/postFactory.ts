import {
  createCaptionContext,
  getRandomStrategyType,
} from '../textGenerator/captionContext'

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
    // Use a stable seed from the full unique query to avoid collisions
    const seed = encodeURIComponent(
      query
        .split('')
        .reduce((a, b) => {
          a = (a << 5) - a + b.charCodeAt(0)
          return a & a
        }, 0)
        .toString()
    )
    return {
      full: `https://picsum.photos/seed/${seed}/800/800`,
      thumb: `https://picsum.photos/seed/${seed}/200/200`,
    }
  }

  try {
    // Extract base category from unique query, but keep full uniqueness
    const baseCategory = query.split('-')[0]
    // Map categories to more specific Unsplash queries
    const categoryQueries = {
      people: 'portrait,person,face,selfie',
      food: 'food,meal,dish,restaurant',
      nature: 'landscape,nature,forest,mountain',
      animals: 'animal,pet,dog,cat,wildlife',
      city: 'city,urban,architecture,building',
      studying: 'study,books,education,learning',
    }

    const searchQuery =
      categoryQueries[baseCategory as keyof typeof categoryQueries] ||
      baseCategory
    // Use the full unique query to reduce duplicates across users
    const fullQuery = `${searchQuery} ${query}`
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(
        fullQuery
      )}&client_id=${ACCESS_KEY}&count=1&w=800&h=800&fit=crop`
    )
    if (!response.ok) throw new Error(`Unsplash API error: ${response.status}`)

    const data = await response.json()
    // Unsplash returns an array, so we need to get the first element
    const photo = Array.isArray(data) ? data[0] : data
    if (!photo || !photo.urls) {
      throw new Error('Invalid response from Unsplash API')
    }
    return {
      full: photo.urls.full,
      thumb: photo.urls.thumb,
    }
  } catch (error) {
    console.warn(`Unsplash API failed, using unique placeholder: ${error}`)
    // Use a hash of the query to get consistent images
    const hash = query.split('').reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0)
      return a & a
    }, 0)
    const imageId = (Math.abs(hash) % 1000) + 1
    return {
      full: `https://picsum.photos/id/${imageId}/800/800`,
      thumb: `https://picsum.photos/id/${imageId}/200/200`,
    }
  }
}

export async function postFactory(userId: string) {
  const categories = ['nature', 'people', 'animals', 'city', 'food', 'studying']
  const randomCategory =
    categories[Math.floor(Math.random() * categories.length)]

  // Create caption context with specified strategy or random
  const captionStrategy = getRandomStrategyType()
  const captionContext = createCaptionContext(captionStrategy)

  // Generate caption using Strategy Pattern
  const caption = captionContext.generateCaption(randomCategory)

  // Fetch unique image for each post (no caching)
  // Create a stable unique query based on category and user
  const uniqueQuery = `${randomCategory}-${userId}-${Math.random()
    .toString(36)
    .substr(2, 9)}`

  let imageData: { full: string; blurDataURL: string }
  try {
    const image = await fetchUnsplashImage(uniqueQuery)
    const blurDataURL = await getBlurDataURL(image.full)
    imageData = { full: image.full, blurDataURL }
  } catch {
    // Fallback to seeded placeholder to avoid aborting post creation
    const seed = encodeURIComponent(
      uniqueQuery
        .split('')
        .reduce((a, b) => {
          a = (a << 5) - a + b.charCodeAt(0)
          return a & a
        }, 0)
        .toString()
    )
    const full = `https://picsum.photos/seed/${seed}/800/800`
    const blurDataURL = await getBlurDataURL(full)
    imageData = { full, blurDataURL }
  }

  return {
    content: caption,
    image: imageData.full,
    blurDataURL: imageData.blurDataURL,
    userId,
    createdAt: new Date(),
  }
}
