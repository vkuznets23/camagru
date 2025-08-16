'use client'
import { useTheme } from '@/context/DarkModeContext'
import styles from '@/styles/DarkModeToggle.module.css'
// import { AiFillSun } from 'react-icons/ai'
import { IoSunny } from 'react-icons/io5'

import { IoMoon } from 'react-icons/io5'

export default function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className={styles.toggleBtn}
      onClick={toggleTheme}
      aria-label="Change theme"
      role="switch"
      aria-checked={isDark}
    >
      <span className={styles.track}>
        <span className={styles.ball} aria-hidden="true" />
        <span className={styles.iconSun} aria-hidden="true">
          <IoSunny />
        </span>
        <span className={styles.iconMoon} aria-hidden="true">
          <IoMoon />
        </span>
      </span>
    </button>
  )
}
