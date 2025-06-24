import styles from '@/styles/Profile.module.css'

interface Props {
  name: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
}

export default function NameInput({ name, onChange, error }: Props) {
  return (
    <>
      <input
        maxLength={30}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        value={name}
        onChange={onChange}
      />
      <div className={styles.errorContainer}>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.charCount}>{name.length}/30</div>
      </div>
    </>
  )
}
