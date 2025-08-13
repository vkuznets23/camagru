'use client'

import { useState, useEffect } from 'react'
import { getSession } from 'next-auth/react'
import PasswordInput from '@/components/PasswordInput'
import TextInput from '@/components/TextInput'
import styles from '@/styles/SettingsUserEdit.module.css'
import PasswordStrengthBar from '@/components/PasswordStrengthBar'

export default function SettingsPage() {
  const [username, setUsername] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string
    currentPassword?: string
    newPassword?: string
    confirmPassword?: string
  }>({})
  const [passwordStrength, setPasswordStrength] = useState(0)

  function calculateStrength(password: string) {
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    if (password.length >= 12) score++
    return Math.min(score, 4) // 0–4
  }

  const fetchCurrentUser = async () => {
    const session = await getSession()
    if (session?.user?.username) setUsername(session.user.username)
  }

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  const handleUsernameUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})
    setMessage(null)

    if (!username.trim()) {
      setFieldErrors({ username: 'Username cannot be empty' })
      return
    }

    try {
      const res = await fetch('/api/user/update-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setMessage('Username updated successfully')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFieldErrors({ username: err.message })
      } else {
        setFieldErrors({ username: 'An unexpected error occurred' })
      }
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})
    setMessage(null)

    if (newPassword !== confirmPassword) {
      setFieldErrors({ confirmPassword: 'New passwords do not match' })
      return
    }

    try {
      const res = await fetch('/api/user/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setMessage('Password updated successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFieldErrors({ currentPassword: err.message })
      } else {
        setFieldErrors({ currentPassword: 'An unexpected error occurred' })
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        {message && <div className={styles.message}>{message}</div>}
        <div className={styles.formBox}>
          <p className={styles.infoText}>
            Here you can change your username. Must be unique, 3–20 characters,
            and can include letters, numbers, or underscores.
          </p>
          {/* Username Form */}
          <form onSubmit={handleUsernameUpdate} className={styles.form}>
            <TextInput
              id="login"
              data-testid="login-signin"
              placeholder=""
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
              autoComplete="username"
              error={fieldErrors.username}
              aria-describedby={
                fieldErrors.username ? 'username-error' : undefined
              }
            />

            <button
              type="submit"
              className={styles.button}
              disabled={!username.trim()}
            >
              Update Username
            </button>
          </form>
        </div>

        {/* Password Form */}
        <div className={styles.formBox}>
          <p className={styles.infoText}>
            Your new password should be at least 8 characters long and include
            letters and numbers.
          </p>
          <form onSubmit={handlePasswordUpdate} className={styles.form}>
            <input
              type="text"
              name="username"
              value={username}
              autoComplete="username"
              readOnly
              style={{ display: 'none' }}
              aria-hidden="true"
            />

            <PasswordInput
              id="currentPassword"
              data-testid="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current Password"
              autoComplete="current-password"
              className={styles.input}
              error={fieldErrors.currentPassword}
            />
            <PasswordInput
              id="newPassword"
              data-testid="newPassword"
              value={newPassword}
              onChange={(e) => {
                const value = e.target.value
                setNewPassword(value)
                setPasswordStrength(calculateStrength(value))
              }}
              placeholder="New Password"
              autoComplete="new-password"
              className={styles.input}
              error={fieldErrors.newPassword}
            />
            {newPassword && <PasswordStrengthBar strength={passwordStrength} />}

            <PasswordInput
              id="confirmPassword"
              data-testid="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
              autoComplete="new-password"
              className={styles.input}
              error={fieldErrors.confirmPassword}
            />

            <button
              type="submit"
              className={styles.button}
              disabled={
                !currentPassword.trim() ||
                !newPassword.trim() ||
                !confirmPassword.trim()
              }
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
