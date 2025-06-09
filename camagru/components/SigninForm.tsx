'use client'

import { signIn } from 'next-auth/react'
import ShowHideToggle from '@/components/ShowHideToggle'
import { useRef, useState } from 'react'
import Logo from '@/components/Logo'
import styles from '@/styles/Register.module.css'

export default function SignInForm() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
      window.location.href = '/'
    }
  }

  const isFormIncomplete = !login || !password

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.formBox}>
        <Logo className={styles.logoSignin} />

        <label htmlFor="login">
          <input
            id="login"
            test-dataid="login-signin"
            className={`${styles.input} ${
              errors.login ? styles.inputError : ''
            }`}
            type="text"
            placeholder="Email or Username"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            autoComplete="username"
          />
        </label>
        {errors.login && <p className={styles.error}>{errors.login}</p>}

        <label htmlFor="password" className={styles.label}>
          <div className={styles.passwordWrapper}>
            <input
              id="password"
              name="current-password"
              test-dataid="password-signin"
              className={`${styles.input} ${
                errors.password ? styles.inputError : ''
              }`}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              style={{ paddingRight: '50px' }}
            />
            <ShowHideToggle
              show={showPassword}
              onToggle={() => setShowPassword((prev) => !prev)}
              className={styles.toggleButton}
            />
          </div>
        </label>
        {errors.password && <p className={styles.error}>{errors.password}</p>}
        <button
          type="submit"
          className={styles.button}
          disabled={isFormIncomplete}
        >
          Sign In
        </button>
        {errors.auth && (
          <p className={styles.error} style={{ marginTop: '8px' }}>
            {errors.auth}
          </p>
        )}
        <a href=""> Forgotten your password?</a>
      </form>
      <div className={styles.extraContainer}>
        <p>
          Dont have an account? <a href="/auth/register"> Sign up</a>
        </p>
      </div>
    </>
  )
}
