'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function VerifyEmail() {
  const searchParams = useSearchParams()
  const token = searchParams?.get('token')

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  )
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setErrorMessage('Token is missing')
      return
    }

    async function verifyEmail() {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`)
        if (res.ok) {
          setStatus('success')
        } else {
          const data = await res.json()
          setErrorMessage(data.error || 'Verification failed')
          setStatus('error')
        }
      } catch (error) {
        console.log(error)
        setErrorMessage('Something went wrong')
        setStatus('error')
      }
    }

    verifyEmail()
  }, [token])

  if (status === 'loading') {
    return <p>Verifying your email, please wait...</p>
  }

  if (status === 'success') {
    return (
      <div>
        <h1>Email verified successfully!</h1>
        <p>
          You can now <a href="/auth/signin">sign in</a>.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h1>Verification failed</h1>
      <p>{errorMessage}</p>
      <p>Please try again or contact support.</p>
    </div>
  )
}
