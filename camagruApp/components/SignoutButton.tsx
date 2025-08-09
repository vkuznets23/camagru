'use client'

import { signOut, useSession } from 'next-auth/react'
import styles from '../styles/SignoutButton.module.css'

export default function SignoutButton() {
  const { data: session } = useSession()

  return (
    <div>
      {session && (
        <button
          className={styles.button}
          onClick={() => signOut({ callbackUrl: '/auth/signin' })}
        >
          Sign Out
        </button>
      )}
    </div>
  )
}
