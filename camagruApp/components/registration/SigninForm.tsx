'use client'

import { signIn, getSession } from 'next-auth/react'
import { useRef, useState } from 'react'
import styles from '@/styles/Register.module.css'
import Button from '@/components/Button'
import TextInput from '@/components/TextInput'
import PasswordInput from '@/components/PasswordInput'
import RegisterLogo from '../RegisterLogo'
import { useTheme } from '@/context/DarkModeContext'
import { validateSignInForm } from '@/utils/formValidations'

export default function SignInForm() {
  const { theme } = useTheme()

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const loginRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const handleValidation = () => {
    const newErrors = validateSignInForm(login, password)

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
    return true
  }

  const handleLogin = async () => {
    const res = await signIn('credentials', {
      redirect: false,
      login,
      password,
    })

    if (res?.error) {
      setErrors({
        auth: res.status === 401 ? 'Invalid login or password' : res.error,
      })
      loginRef.current?.focus()
      return false
    }
    return true
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!handleValidation()) return

    if (await handleLogin()) {
      const session = await getSession()
      const userId = session?.user?.id
      window.location.assign(userId ? `/user/${userId}` : '/')
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
          ref={loginRef}
          id="login"
          data-testid="login-signin"
          placeholder="Email or Username"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          error={errors.login}
          className={styles.input}
          autoComplete="username"
          aria-label="Email or username"
        />

        <div className={styles.passwordWrapper}>
          <PasswordInput
            ref={passwordRef}
            id="password"
            data-testid="password-signin"
            className={styles.input}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            error={errors.password}
            aria-label="Password"
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
