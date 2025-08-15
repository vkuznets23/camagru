'use client'

import styles from '@/styles/PasswordRequirements.module.css'

interface PasswordRequirementsProps {
  password: string
}

export default function PasswordRequirements({
  password,
}: PasswordRequirementsProps) {
  const requirements = [
    {
      label: 'At least 8 characters',
      test: (pw: string) => pw.length >= 8,
    },
    {
      label: 'At least one lowercase letter',
      test: (pw: string) => /[a-z]/.test(pw),
    },
    {
      label: 'At least one uppercase letter',
      test: (pw: string) => /[A-Z]/.test(pw),
    },
    {
      label: 'At least one number',
      test: (pw: string) => /[0-9]/.test(pw),
    },
    {
      label: 'At least one symbol',
      test: (pw: string) => /[^a-zA-Z0-9]/.test(pw),
    },
  ]

  return (
    <ul className={styles.list}>
      {requirements.map((req, idx) => {
        const passed = req.test(password)
        return (
          <li key={idx} className={passed ? styles.passed : styles.failed}>
            {req.label}
          </li>
        )
      })}
    </ul>
  )
}
