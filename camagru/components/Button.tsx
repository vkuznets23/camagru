import React from 'react'
import styles from '@/styles/Register.module.css'

interface ButtonProps {
  id: string
  testid: string
  text: string
  disabled?: boolean
}

export default function Button({
  id,
  testid,
  text,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      id={id}
      data-testid={testid}
      type="submit"
      className={styles.button}
      disabled={disabled}
    >
      {text}
    </button>
  )
}
