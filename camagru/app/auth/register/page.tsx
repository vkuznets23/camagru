'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  validateEmail,
  validateUsername,
  validatePassword,
} from '@/utils/formValidations'
import { checkAvailability, updateAvailabilityError } from '@/utils/api'
import zxcvbn from 'zxcvbn'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  )

  const router = useRouter()

  function checkPasswordStrength(pw: string) {
    const result = zxcvbn(pw)
    const score = result.score // 0 weak → 4 strong
    return score
  }

  const strengthLabels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong']

  async function checkEmailAvailability(emailToCheck: string) {
    if (!emailToCheck) return
    const available = await checkAvailability(
      'check-email',
      'email',
      emailToCheck
    )
    setEmailAvailable(available)
    setErrors((prev) =>
      updateAvailabilityError(
        prev,
        'email',
        available,
        'Email is already taken'
      )
    )
  }

  async function checkUsernameAvailability(usernameToCheck: string) {
    if (!usernameToCheck) return
    const available = await checkAvailability(
      'check-username',
      'username',
      usernameToCheck
    )
    setUsernameAvailable(available)
    setErrors((prev) =>
      updateAvailabilityError(
        prev,
        'username',
        available,
        'Username is already taken'
      )
    )
  }

  function validateForm(
    email: string,
    username: string,
    password: string,
    emailAvailable: boolean | null,
    usernameAvailable: boolean | null
  ) {
    const newErrors: { [key: string]: string } = {}

    const emailError = validateEmail(email, emailAvailable)
    if (emailError) newErrors.email = emailError

    const usernameError = validateUsername(username, usernameAvailable)
    if (usernameError) newErrors.username = usernameError

    const passwordError = validatePassword(password)
    if (passwordError) newErrors.password = passwordError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')

    const trimmedEmail = email.trim().toLowerCase()
    const trimmedUsername = username.trim()

    const isValid = validateForm(
      trimmedEmail,
      trimmedUsername,
      password,
      emailAvailable,
      usernameAvailable
    )
    if (!isValid) return

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: trimmedEmail,
        username: trimmedUsername,
        password,
      }),
    })

    const data = await res.json()
    if (res.ok) {
      setEmail('')
      setUsername('')
      setPassword('')
      setPasswordStrength(0)
      setErrors({})

      router.push('/auth/signin')
    } else {
      setMessage(data.error || 'Something went wrong')
    }
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setPassword(value)
    setPasswordStrength(checkPasswordStrength(value))
  }

  // DELTE
  function getPasswordColor(score: number) {
    if (score <= 1) return 'red'
    if (score === 2) return 'orange'
    return 'green'
  }
  return (
    <>
      <p>signup to see photos and videos from your friends.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">
          <input
            id="email"
            data-testid="email"
            type="email"
            placeholder="email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setEmailAvailable(null)
            }}
            onBlur={() => checkEmailAvailability(email.trim().toLowerCase())}
          />
          {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
        </label>
        <br />
        <label htmlFor="username">
          <input
            id="username"
            data-testid="username"
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value)
              setUsernameAvailable(null)
            }}
            onBlur={() => checkUsernameAvailability(username.trim())}
            autoComplete="username"
          />
          {errors.username && (
            <span style={{ color: 'red' }}>{errors.username}</span>
          )}
        </label>
        <br />
        <label htmlFor="password">
          <input
            id="password"
            data-testid="password"
            type="password"
            placeholder="password"
            value={password}
            onChange={handlePasswordChange}
            autoComplete="current-password"
          />
          {errors.password && (
            <span style={{ color: 'red' }}>{errors.password}</span>
          )}
        </label>
        <br />
        {password && (
          <p style={{ color: getPasswordColor(passwordStrength) }}>
            Password strength: {strengthLabels[passwordStrength]}
          </p>
        )}
        <button type="submit">Register</button>
        <p>{message}</p>
      </form>
    </>
  )
}
