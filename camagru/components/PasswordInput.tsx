import { useState } from 'react'
import ShowHideToggle from '@/components/ShowHideToggle'
import styles from '@/styles/Register.module.css'

type PasswordInputProps = {
  id: string
  testdataid: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  className?: string
  autoComplete: string
}

export default function PasswordInput({
  id,
  testdataid,
  placeholder,
  value,
  onChange,
  error,
  className = '',
  autoComplete,
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
        />
        <ShowHideToggle
          show={show}
          onToggle={() => setShow(!show)}
          className={styles.toggleButton}
        />
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </label>
  )
}
