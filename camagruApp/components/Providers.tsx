'use client'

import { ReactNode, useEffect, useState } from 'react'
import { SessionProvider, useSession } from 'next-auth/react'
import { ThemeProvider } from '@/context/DarkModeContext'
import { User } from '@/types/user'
import { UserProvider } from '@/context/userContext'
import { Post } from '@/types/post'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <ClientSessionHandler>{children}</ClientSessionHandler>
        {/* {children} */}
      </ThemeProvider>
    </SessionProvider>
  )
}

function ClientSessionHandler({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const { data: session } = useSession()

  useEffect(() => {
    if (!session?.user?.id) {
      setUser(null)
      setPosts([])
      return
    }

    const fetchUserAndPosts = async () => {
      try {
        const [userRes, postsRes] = await Promise.all([
          fetch(`/api/user/${session.user.id}`, { credentials: 'include' }),
          fetch(`/api/feed?skip=0&limit=12`, { credentials: 'include' }),
        ])
        if (!userRes.ok) {
          const text = await userRes.text()
          console.error('User fetch failed:', userRes.status, text)
          throw new Error('Failed to fetch user data')
        }

        if (!postsRes.ok) {
          const text = await postsRes.text()
          console.error('Posts fetch failed:', postsRes.status, text)
          throw new Error('Failed to fetch posts data')
        }
        const userData = await userRes.json()
        const postsData: Post[] = await postsRes.json()
        setUser(userData)
        setPosts(postsData || [])
      } catch (err) {
        console.error(err)
        setUser(null)
        setPosts([])
      }
    }

    fetchUserAndPosts()
  }, [session])

  return (
    <UserProvider initialUser={user} initialPosts={posts}>
      {children}
    </UserProvider>
  )
}
