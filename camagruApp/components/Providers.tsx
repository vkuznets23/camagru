'use client'

import { ReactNode, useEffect, useState } from 'react'
import { SessionProvider, useSession } from 'next-auth/react'
import { ThemeProvider } from '@/context/DarkModeContext'
import { User } from '@/types/user'
import { UserProvider } from '@/context/userContext'
import { useRouter, usePathname } from 'next/navigation'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <ClientSessionHandler>{children}</ClientSessionHandler>
      </ThemeProvider>
    </SessionProvider>
  )
}

function ClientSessionHandler({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'loading') return

    const publicPages = [
      '/auth/signin',
      '/auth/register',
      '/auth/forgot-password',
      '/auth/notification',
      '/auth/reset-password',
      '/auth/verify-email',
      '/auth/verify-request',
    ]
    if (publicPages.includes(pathname || '')) return

    if (!session?.user?.id) {
      router.push('/')
      return
    }

    const fetchUser = async () => {
      try {
        const userRes = await fetch(`/api/user/${session.user.id}`, {
          credentials: 'include',
        })
        if (!userRes.ok) {
          const text = await userRes.text()
          console.error('User fetch failed:', userRes.status, text)
          throw new Error('Failed to fetch user data')
        }
        const userData = await userRes.json()
        setUser(userData)
      } catch (err) {
        console.error(err)
        setUser(null)
        router.push('/')
      }
    }

    fetchUser()
  }, [session, status, router, pathname])

  return (
    <UserProvider initialUser={user} initialPosts={[]}>
      {children}
    </UserProvider>
  )
}
