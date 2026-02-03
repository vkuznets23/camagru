import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import FeedPageClient from '@/components/feed/FeedPageClient'
import { type Post } from '@/types/post'

export default async function FeedPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/')
  }

  try {
    const headersList = await headers()
    const cookie = headersList.get('cookie') || ''

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/feed?skip=0&limit=12`, {
      headers: {
        cookie,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch feed')
    }

    const posts: Post[] = await response.json()

    return <FeedPageClient initialPosts={posts} />
  } catch (error) {
    console.error('Failed to load feed:', error)
    redirect('/')
  }
}
