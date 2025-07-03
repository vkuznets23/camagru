'use client'

import { signOut, useSession } from 'next-auth/react'

export default function SignoutButton() {
  const { data: session } = useSession()

  return (
    <div>
      {session && (
        <button onClick={() => signOut({ callbackUrl: '/auth/signin' })}>
          Sign Out
        </button>
      )}
    </div>
  )
}
