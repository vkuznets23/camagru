'use client'

import { useRef, useState } from 'react'
import styles from './Register.module.css'
import { useRouter } from 'next/navigation'
import { BiHide, BiShow } from 'react-icons/bi'
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
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  )

  const router = useRouter()

  // show hide button for pswrd
  function checkPasswordStrength(pw: string) {
    const result = zxcvbn(pw)
    const score = result.score // 0 weak → 4 strong
    return score
  }

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
  const usernameDebounceTimeout = useRef<NodeJS.Timeout | null>(null)

  function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setUsername(val)
    setUsernameAvailable(null)

    const usernameError = validateUsername(val.trim(), null)
    setErrors((prev) => ({ ...prev, username: usernameError || '' }))

    if (usernameDebounceTimeout.current) {
      clearTimeout(usernameDebounceTimeout.current)
    }

    if (!usernameError && val.trim() !== '') {
      usernameDebounceTimeout.current = setTimeout(() => {
        checkUsernameAvailability(val.trim())
      }, 500)
    } else {
      setUsernameAvailable(null)
    }
  }

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setEmail(val)
    setEmailAvailable(null)

    const emailError = validateEmail(val.trim(), null)
    setErrors((prev) => ({ ...prev, email: emailError || '' }))

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    if (!emailError && val.trim() !== '') {
      debounceTimeout.current = setTimeout(() => {
        checkEmailAvailability(val.trim().toLowerCase())
      }, 500)
    } else {
      setEmailAvailable(null)
    }
  }

  const isFormIncomplete =
    !email || !username || !password || Object.keys(errors).length > 0

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.formBox}>
        <p className={styles.heading}>
          Sign up to see photos and videos from your friends.
        </p>

        <label htmlFor="email">
          <input
            id="email"
            data-testid="email"
            type="email"
            placeholder="Email address"
            className={`${styles.input} ${
              errors.email ? styles.inputError : ''
            }`}
            value={email}
            onChange={handleEmailChange}
            onBlur={() => checkEmailAvailability(email.trim().toLowerCase())}
          />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </label>

        <label htmlFor="username">
          <input
            id="username"
            data-testid="username"
            type="text"
            placeholder="Username"
            className={`${styles.input} ${
              errors.username ? styles.inputError : ''
            }`}
            value={username}
            onChange={handleUsernameChange}
            autoComplete="username"
          />
          {errors.username && (
            <span className={styles.error}>{errors.username}</span>
          )}
        </label>

        <label htmlFor="password" className={styles.label}>
          <input
            id="password"
            data-testid="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className={`${styles.input} ${
              errors.password ? styles.inputError : ''
            }`}
            value={password}
            onChange={handlePasswordChange}
            autoComplete="current-password"
            style={{ paddingRight: '50px' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className={styles.toggleButton}
          >
            {showPassword ? <BiHide /> : <BiShow />}
          </button>
          {errors.password && (
            <span className={styles.error}>{errors.password}</span>
          )}
        </label>

        {password && (
          <div className={styles.strengthBarContainer}>
            <div
              className={`${styles.strengthBarFill} ${
                styles[
                  ['weak', 'fair', 'medium', 'good', 'strong'][
                    passwordStrength
                  ] || 'weak'
                ]
              }`}
            ></div>
          </div>
        )}

        <button
          type="submit"
          className={styles.button}
          disabled={isFormIncomplete}
        >
          Register
        </button>

        <p style={{ textAlign: 'center', color: 'red', marginTop: '10px' }}>
          {message}
        </p>
      </form>
    </div>
  )
}
