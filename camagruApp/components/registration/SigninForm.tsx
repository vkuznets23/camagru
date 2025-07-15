'use client'

import { signIn, getSession } from 'next-auth/react'
import { useRef, useState } from 'react'
import styles from '@/styles/Register.module.css'
import Button from '@/components/Button'
import TextInput from '@/components/TextInput'
import PasswordInput from '@/components/PasswordInput'
import RegisterLogo from '../RegisterLogo'
import { useTheme } from '@/context/DarkModeContext'

export default function SignInForm() {
  const { theme } = useTheme()

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const loginRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newErrors: { [key: string]: string } = {}

    if (!login) {
      newErrors.login = 'Please enter your email or username'
    }

    if (!password) {
      newErrors.password = 'Please enter your password'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)

      if (newErrors.login) {
        loginRef.current?.focus()
      } else if (newErrors.password) {
        passwordRef.current?.focus()
      }

      return
    }

    setErrors({})

    const res = await signIn('credentials', {
      redirect: false,
      login,
      password,
    })

    if (res?.error) {
      if (res.status === 401) {
        setErrors({ auth: 'Invalid login or password' })
      } else {
        setErrors({ auth: res.error })
      }
    } else {
      const session = await getSession()
      const userId = session?.user?.id
      if (userId) {
        window.location.assign(`/user/${userId}`)
      } else {
        window.location.assign('/')
      }
    }
  }

  const isFormIncomplete = !login || !password

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.formBox}>
        <div className={styles.logoContainer}>
          <RegisterLogo
            className={styles.logo}
            text="Sign in to see photos and videos from your friends"
            mode={theme}
          />
        </div>

        <TextInput
          id="login"
          data-testid="login-signin"
          placeholder="Email or Username"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          error={errors.login}
          className={styles.input}
          autoComplete="username"
        />

        <div className={styles.passwordWrapper}>
          <PasswordInput
            id="password"
            data-testid="password-signin"
            className={styles.input}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            error={errors.password}
          />
        </div>
        {errors.auth && <p className={styles.error}>{errors.auth}</p>}
        <Button
          id="signin-button"
          testid="signin-button"
          text="Sign In"
          disabled={isFormIncomplete}
        />

        <a className={styles.forgotPassword} href="/auth/forgot-password">
          Forgotten your password?
        </a>
      </form>
      <div className={styles.extraContainer}>
        <p>
          Dont have an account? <a href="/auth/register"> Sign up</a>
        </p>
      </div>
    </>
  )
}
