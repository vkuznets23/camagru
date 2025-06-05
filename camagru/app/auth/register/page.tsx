'use client'

import { useState } from 'react'
import zxcvbn from 'zxcvbn'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  function checkPasswordStrength(pw: string) {
    const result = zxcvbn(pw)
    const score = result.score // 0 weak → 4 strong
    return score
  }

  function validateForm() {
    const newErrors: { [key: string]: string } = {}

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!username) {
      newErrors.username = 'Username is required'
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[!@#$%^&*]/.test(password)
    ) {
      newErrors.password = 'Password must include uppercase, number, and symbol'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const strengthLabels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong']

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')

    const isValid = validateForm()
    if (!isValid) return

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    })

    const data = await res.json()
    if (res.ok) {
      setMessage('User registered! You can now sign in.')
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
            placeholder="email adress"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setUsername(e.target.value)}
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
