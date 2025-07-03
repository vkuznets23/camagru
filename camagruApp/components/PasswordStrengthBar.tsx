import styles from '@/styles/Register.module.css'

interface PasswordStrengthBarProps {
  strength: number
}

const strengthLabels = ['weak', 'fair', 'medium', 'good', 'strong']

export default function PasswordStrengthBar({
  strength,
}: PasswordStrengthBarProps) {
  const label = strengthLabels[strength] || 'weak'

  return (
    <div className={styles.strengthBarContainer}>
      <div
        data-testid="strength-bar"
        className={`${styles.strengthBarFill} ${styles[label]}`}
      ></div>
    </div>
  )
}
