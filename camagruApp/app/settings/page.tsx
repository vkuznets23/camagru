import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import SettingsPageClient from '@/components/settings/SettingsPageClient'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/')
  }

  try {
    const headersList = await headers()
    const cookie = headersList.get('cookie') || ''
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

    const response = await fetch(`${baseUrl}/api/user/${session.user.id}`, {
      headers: {
        cookie,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user data')
    }

    const user = await response.json()

    return <SettingsPageClient initialUser={user} />
  } catch (error) {
    console.error('Failed to load user:', error)
    redirect('/')
  }
}
