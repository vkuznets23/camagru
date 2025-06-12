import styles from '@/styles/Register.module.css'

type TextInputProps = {
  id: string
  testdataid: string
  type?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  className?: string
  autoComplete?: string
}

export default function TextInput({
  id,
  testdataid,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  className = '',
  autoComplete,
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
      />
      {error && <span className={styles.error}>{error}</span>}
    </label>
  )
}
