'use client'

import { useTheme } from '@/context/DarkModeContext'
import styles from '@/styles/DarkModeToggle.module.css'

export default function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className={styles.toggleWrapper}>
      <input
        type="checkbox"
        id="toggle"
        checked={isDark}
        onChange={toggleTheme}
        className={styles.checkbox}
      />
      <label htmlFor="toggle" className={styles.label}>
        <span className={styles.ball} />
      </label>
    </div>
  )
}
