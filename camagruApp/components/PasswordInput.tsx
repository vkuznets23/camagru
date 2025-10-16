import { useState } from 'react'
import ShowHideToggle from '@/components/ShowHideToggle'
import styles from '@/styles/Register.module.css'

type PasswordInputProps = {
  id: string
  'data-testid': string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  className?: string
  autoComplete: string
  'aria-label'?: string
}

export default function PasswordInput({
  id,
  'data-testid': testdataid,
  placeholder,
  value,
  onChange,
  error,
  className = '',
  autoComplete,
  'aria-label': ariaLabel,
}: PasswordInputProps) {
  const [show, setShow] = useState(false)

  return (
    <label htmlFor={id} className={styles.label}>
      <div className={styles.passwordWrapper}>
        <input
          id={id}
          data-testid={testdataid}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className={`${className} ${error ? styles.inputError : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-label={ariaLabel || 'Password'}
        />
        <ShowHideToggle
          show={show}
          onToggle={() => setShow(!show)}
          className={styles.toggleButton}
        />
      </div>
      {error && (
        <span data-testid={`${id}-error`} role="alert" className={styles.error}>
          {error}
        </span>
      )}
    </label>
  )
}
