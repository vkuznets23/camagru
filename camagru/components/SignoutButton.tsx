'use client'

import { signOut, useSession } from 'next-auth/react'

export default function SignoutButton() {
  const { data: session } = useSession()

  return (
    <div>
      {session && (
        <button
          onClick={() => signOut({ callbackUrl: '/auth/signin' })}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
        >
          Sign Out
        </button>
      )}
    </div>
  )
}
