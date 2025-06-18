'use client'

import { useRef, useState } from 'react'
import styles from '@/styles/Register.module.css'
import { useRouter } from 'next/navigation'
import {
  validateEmail,
  validateUsername,
  validatePassword,
  checkPasswordStrength,
} from '@/utils/formValidations'
import { checkAvailability, updateAvailabilityError } from '@/utils/api'
import Logo from '@/components/Logo'
import PasswordStrengthBar from '../PasswordStrengthBar'
import Button from '../Button'
import TextInput from '../TextInput'
import PasswordInput from '../PasswordInput'

export default function RegisterForm() {
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
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)
  const usernameDebounceTimeout = useRef<NodeJS.Timeout | null>(null)

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
    if (emailError) {
      newErrors.email = emailError
    }

    const usernameError = validateUsername(username, usernameAvailable)
    if (usernameError) {
      newErrors.username = usernameError
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      newErrors.password = passwordError
    }

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

      router.push('/auth/notification')
    } else {
      setMessage(data.error || 'Something went wrong')
    }
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setPassword(value)
    setPasswordStrength(checkPasswordStrength(value))

    const passwordError = validatePassword(value)
    setErrors((prev) => ({ ...prev, password: passwordError || '' }))
  }

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
    !email ||
    !username ||
    !password ||
    Object.values(errors).some((err) => err && err.trim() !== '')

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.formBox}>
        <div className={styles.logoContainer}>
          <Logo
            className={styles.logo}
            text="Sign up to see photos and videos from your friends"
          />
        </div>
        <TextInput
          id="email"
          data-testid="email"
          type="email"
          placeholder="Email address"
          className={styles.input}
          value={email}
          onChange={handleEmailChange}
          error={errors.email}
        />
        <TextInput
          id="username"
          data-testid="username"
          placeholder="Username"
          className={styles.input}
          value={username}
          onChange={handleUsernameChange}
          autoComplete="username"
          error={errors.username}
        />
        <PasswordInput
          id="password"
          data-testid="password"
          placeholder="Password"
          className={styles.input}
          value={password}
          onChange={handlePasswordChange}
          autoComplete="new-password"
          error={errors.password}
        />
        {password && <PasswordStrengthBar strength={passwordStrength} />}
        <Button
          id="register-button"
          testid="register-button"
          text="Sign Up"
          disabled={isFormIncomplete}
        />
        <p style={{ textAlign: 'center', color: 'red', marginTop: '10px' }}>
          {message}
        </p>
      </form>
      <div className={styles.extraContainer}>
        <p>
          Already have an account? <a href="/auth/signin"> Sign in</a>
        </p>
      </div>
    </>
  )
}
