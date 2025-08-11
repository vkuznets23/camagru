'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import styles from '@/styles/Register.module.css'
import {
  checkPasswordStrength,
  validatePassword,
} from '@/utils/formValidations'
import PasswordStrengthBar from '@/components/PasswordStrengthBar'
import Button from '@/components/Button'
import PasswordInput from '@/components/PasswordInput'
import SuccessMessage from '@/components/SuccessMessage'

export default function ResetPassword() {
  const searchParams = useSearchParams()
  const token = searchParams?.get('token')

  const [password, setPassword] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

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

      setTimeout(() => {
        router.push('/')
      }, 2000)
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
        <PasswordInput
          id="password"
          data-testid="password"
          placeholder="New password"
          className={styles.input}
          value={password}
          onChange={handlePasswordChange}
          autoComplete="new-password"
          error={error}
        />
        {password && <PasswordStrengthBar strength={passwordStrength} />}
        <Button
          id="update-psw-button"
          testid="update-psw-button"
          text="Update Password"
        />
        <SuccessMessage message={message} />
      </form>
    </div>
  )
}
