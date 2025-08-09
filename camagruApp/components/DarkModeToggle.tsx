'use client'

import { useTheme } from '@/context/DarkModeContext'
import styles from '@/styles/DarkModeToggle.module.css'
import { AiFillSun } from 'react-icons/ai'
import { IoMoon } from 'react-icons/io5'

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
        <span className={styles.iconSun}>
          <AiFillSun />
        </span>
        <span className={styles.iconMoon}>
          <IoMoon />
        </span>
      </label>
    </div>
  )
}
