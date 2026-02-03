'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import PasswordInput from '@/components/PasswordInput'
import TextInput from '@/components/TextInput'
import styles from '@/styles/SettingsUserEdit.module.css'
import PasswordStrengthBar from '@/components/PasswordStrengthBar'
import { QRCodeCanvas } from 'qrcode.react'

type User = {
  id: string
  username: string
  name?: string | null
  bio?: string | null
  image?: string | null
}

type SettingsPageClientProps = {
  initialUser: User
}

export default function SettingsPageClient({
  initialUser,
}: SettingsPageClientProps) {
  const [username, setUsername] = useState(initialUser.username)
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
  const [initialUsername, setInitialUsername] = useState(initialUser.username)
  const [isDeleting, setIsDeleting] = useState(false)
  const [profileUrl, setProfileUrl] = useState('')

  const { data: session } = useSession()

  // Автоматически скрывать сообщение через 5 секунд
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  useEffect(() => {
    if (initialUser.id && typeof window !== 'undefined') {
      setProfileUrl(`${window.location.origin}/user/${initialUser.id}`)
    }
  }, [initialUser.id])

  function calculateStrength(password: string) {
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    if (password.length >= 12) score++
    return Math.min(score, 4) // 0–4
  }

  const handleDeleteUser = async () => {
    if (!session?.user?.id) return
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    )
    if (!confirmed) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/user/${session.user.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete user')
      }
      alert('Your account has been deleted.')
      window.location.href = '/'
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`Error: ${err.message}`)
      } else {
        alert('An unexpected error occurred')
      }
      setIsDeleting(false)
    }
  }

  const handleUsernameUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})
    setMessage(null)

    if (!username.trim()) {
      setFieldErrors({ username: 'Username cannot be empty' })
      return
    }

    if (username.trim() === initialUsername.trim()) {
      setFieldErrors({ username: 'This is already your username' })
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
      setInitialUsername(username)
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

    if (newPassword === currentPassword) {
      setFieldErrors({
        newPassword: 'New password must be different from current',
      })
      return
    }

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
      <div className={styles.banner}>
        <p className={styles.bannerText}>
          Scan this QR code to&nbsp;share your&nbsp;profile&nbsp;with friends
        </p>
        <div
          style={{
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '15px',
            display: 'inline-block',
          }}
        >
          <QRCodeCanvas value={profileUrl} size={150} bgColor="transparent" />
        </div>
      </div>
      <div className={styles.formContainer}>
        
        <div className={styles.formBox}>
          <p className={styles.infoText}>
            Here you can&nbsp;change your&nbsp;username. Must be&nbsp;unique,
            3&#8209;20&nbsp;characters, and&nbsp;can include letters, numbers,
            or&nbsp;underscores.
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
            Your new&nbsp;password should be&nbsp;at&nbsp;least
            8&nbsp;characters long and&nbsp;include letters and&nbsp;numbers.
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
        {message && (
          <div
            style={{
              position: 'relative',
              marginBottom: '1rem',
              border: '1px solid var(--accent)',
              padding: '10px',
              borderRadius: '10px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <p className={styles.message}>{message}!</p>

          </div>
        )}
        <div className={styles.formBox}>
          <p className={styles.infoText}>
            Delete your account. This action is permanent and cannot be undone.
          </p>
          <button
            type="button"
            className={styles.deleteButton}
            onClick={handleDeleteUser}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  )
}

