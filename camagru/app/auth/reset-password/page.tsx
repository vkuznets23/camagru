'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import styles from '@/styles/Register.module.css'
import {
  checkPasswordStrength,
  validatePassword,
} from '@/utils/formValidations'
import PasswordStrengthBar from '@/components/PasswordStrengthBar'
import ShowHideToggle from '@/components/ShowHideToggle'

export default function ResetPassword() {
  const searchParams = useSearchParams()
  const token = searchParams?.get('token')

  const [password, setPassword] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')

    const validationError = validatePassword(password)
    if (validationError) {
      setError(validationError)
      return
    }

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })

    const data = await res.json()
    if (res.ok) {
      setMessage('Password successfully updated')
    } else {
      setError(data.error || 'Invalid or expired token')
    }
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setPassword(value)
    setPasswordStrength(checkPasswordStrength(value))

    const passwordError = validatePassword(value)
    setError(passwordError || '')
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.formBox}>
        <h2>Set a new password</h2>
        <label htmlFor="password" className={styles.label}>
          <div className={styles.passwordWrapper}>
            <input
              id="password"
              name="new-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="New password"
              value={password}
              onChange={handlePasswordChange}
              className={`${styles.input} ${error ? styles.inputError : ''} `}
              autoComplete="new-password"
              style={{ paddingRight: '50px' }}
            />
            <ShowHideToggle
              show={showPassword}
              onToggle={() => setShowPassword((prev) => !prev)}
              className={styles.toggleButton}
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
        </label>

        {password && <PasswordStrengthBar strength={passwordStrength} />}

        <button type="submit" className={styles.button}>
          Update Password
        </button>
        {message && <p style={{ color: 'green' }}>{message}</p>}
      </form>
    </div>
  )
}
