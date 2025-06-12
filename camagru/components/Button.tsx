import React from 'react'
import styles from '@/styles/Register.module.css'

interface ButtonProps {
  text: string
  disabled?: boolean
}

export default function Button({ text, disabled = false }: ButtonProps) {
  return (
    <button type="submit" className={styles.button} disabled={disabled}>
      {text}
    </button>
  )
}
