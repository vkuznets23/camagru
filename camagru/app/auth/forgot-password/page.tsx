'use client'

import styles from '@/styles/Register.module.css'
import { useState } from 'react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!email) {
      setError('Please enter your email')
      return
    }

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()
    if (res.ok) {
      setEmail('')
      setMessage('Password reset link sent to your email')
    } else {
      setError(data.error || 'Something went wrong')
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.formBox}>
        <h2>Reset your password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Send Reset Link
        </button>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  )
}
