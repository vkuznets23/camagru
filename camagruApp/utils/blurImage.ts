import sharp from 'sharp'
import fetch from 'node-fetch'

export async function getBlurDataURL(imageUrl: string) {
  try {
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`)
    }
    const buffer = await response.buffer()

    const resized = await sharp(buffer)
      .resize(10, 10)
      .blur()
      .jpeg({ quality: 50 })
      .toBuffer()

    const base64 = resized.toString('base64')
    return `data:image/jpeg;base64,${base64}`
  } catch (error) {
    console.warn(
      `BlurDataURL generation failed for ${imageUrl}:`,
      error instanceof Error ? error.message : 'Unknown error'
    )
    // Return a simple fallback blur data URL
    return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
  }
}
