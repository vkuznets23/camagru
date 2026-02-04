import { useState, forwardRef } from 'react'
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

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  {
    id,
    'data-testid': testdataid,
    placeholder,
    value,
    onChange,
    error,
    className = '',
    autoComplete,
    'aria-label': ariaLabel,
  },
  ref,
) {
  const [show, setShow] = useState(false)

  return (
    <label htmlFor={id} className={styles.label}>
      <div className={styles.passwordWrapper}>
        <input
          ref={ref}
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
})

export default PasswordInput
