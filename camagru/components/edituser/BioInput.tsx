import styles from '@/styles/Profile.module.css'

interface Props {
  bio: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  error?: string
}

export default function BioInput({ bio, onChange, error }: Props) {
  return (
    <>
      <textarea
        maxLength={150}
        className={`${styles.textarea} ${error ? styles.inputError : ''}`}
        value={bio}
        onChange={onChange}
      />
      <div className={styles.errorContainer}>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.charCount}>{bio.length}/150</div>
      </div>
    </>
  )
}
