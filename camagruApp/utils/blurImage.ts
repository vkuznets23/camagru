import sharp from 'sharp'
import fetch from 'node-fetch'

export async function getBlurDataURL(imageUrl: string) {
  const response = await fetch(imageUrl)
  const buffer = await response.buffer()

  const resized = await sharp(buffer)
    .resize(10, 10)
    .blur()
    .jpeg({ quality: 50 })
    .toBuffer()

  const base64 = resized.toString('base64')
  return `data:image/jpeg;base64,${base64}`
}
