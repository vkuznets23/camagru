import React from 'react'
import styles from '@/styles/Register.module.css'

interface ButtonProps {
  id: string
  testid: string
  text: string
  disabled?: boolean
  'aria-label'?: string
  'aria-disabled'?: boolean
}

export default function Button({
  id,
  testid,
  text,
  disabled = false,
  'aria-label': ariaLabel,
  'aria-disabled': ariaDisabled,
}: ButtonProps) {
  return (
    <button
      id={id}
      data-testid={testid}
      type="submit"
      className={styles.button}
      disabled={disabled}
      aria-label={ariaLabel || text}
      aria-disabled={ariaDisabled}
    >
      {text}
    </button>
  )
}
