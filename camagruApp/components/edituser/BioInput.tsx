import styles from '@/styles/Profile.module.css'

interface Props {
  bio: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  error?: string
}

export default function BioInput({ bio, onChange, error }: Props) {
  const textareaId = `textarea`
  const errorId = `error`
  const counterId = `counter`

  return (
    <>
      <textarea
        id={textareaId}
        maxLength={150}
        className={`${styles.textarea} ${error ? styles.inputError : ''}`}
        value={bio}
        onChange={onChange}
        aria-invalid={!!error}
        aria-describedby={`${error ? errorId : ''} ${counterId}`}
      />
      <div id={errorId} className={styles.errorContainer}>
        {error && <p className={styles.error}>{error}</p>}
        <div id={counterId} className={styles.charCount}>
          {bio.length}/150
        </div>
      </div>
    </>
  )
}
