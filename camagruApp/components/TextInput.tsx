import styles from '@/styles/Register.module.css'

type TextInputProps = {
  id: string
  'data-testid': string
  type?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  className?: string
  autoComplete?: string
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onFocus?: () => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  onClick?: () => void
  'aria-label'?: string
  'aria-describedby'?: string
}

export default function TextInput({
  id,
  'data-testid': testdataid,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  className = '',
  autoComplete,
  onKeyDown,
  onFocus,
  onBlur,
  onClick,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}: TextInputProps) {
  return (
    <label htmlFor={id}>
      <input
        id={id}
        data-testid={testdataid}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`${className} ${error ? styles.inputError : ''}`}
        autoComplete={autoComplete}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onClick}
        aria-label={ariaLabel}
        aria-describedby={
          ariaDescribedBy || (error ? `${id}-error` : undefined)
        }
        aria-invalid={!!error}
      />
      {error && (
        <span data-testid={`${id}-error`} className={styles.error}>
          {error}
        </span>
      )}
    </label>
  )
}
