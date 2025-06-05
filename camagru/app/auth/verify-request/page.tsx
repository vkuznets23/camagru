'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'

export default function VerifyRequest() {
  const searchParams = useSearchParams()

  const success = searchParams?.get('success')
  const error = searchParams?.get('error')

  return (
    <div style={{ padding: 20 }}>
      {success ? (
        <>
          <h1>Email verified successfully!</h1>
          <p>
            You can now <a href="/auth/signin">sign in</a>.
          </p>
        </>
      ) : error ? (
        <>
          <h1>Verification failed</h1>
          <p>{error}</p>
          <p>Please try verifying your email again or contact support.</p>
        </>
      ) : (
        <p>Verifying your email, please wait...</p>
      )}
    </div>
  )
}
