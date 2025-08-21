import styles from '@/styles/Profile.module.css'

interface Props {
  name: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
}

export default function NameInput({ name, onChange, error }: Props) {
  const inputId = `${name}-input`
  const errorId = `${name}-error`
  const counterId = `${name}-counter`

  return (
    <>
      <label htmlFor="input" className={styles.srOnly}>
        Name
      </label>
      <input
        id={inputId}
        maxLength={30}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        value={name}
        placeholder="Your name"
        onChange={onChange}
        aria-invalid={!!error}
        aria-describedby={`${error ? errorId : ''} ${counterId}`}
      />
      <div id={errorId} className={styles.errorContainer}>
        {error && <p className={styles.error}>{error}</p>}
        <div id={counterId} className={styles.charCount}>
          {name.length}/30
        </div>
      </div>
    </>
  )
}
