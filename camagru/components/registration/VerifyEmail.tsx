'use client'

import React, { useEffect, useState } from 'react'
import styles from '@/styles/Verify-email.module.css'
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

  return (
    <div className={styles.bg}>
      <div className={styles.container}>
        {status === 'loading' && <p>Verifying your email, please wait...</p>}
        {status === 'success' && (
          <>
            <h2> Email verified successfully!</h2>
            <p>
              You can now <a href="/auth/signin">sign in</a>.
            </p>
          </>
        )}
        {status === 'error' && (
          <>
            <h2>Verification failed</h2>
            <p>
              {errorMessage} <br /> Please try again or contact support.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
