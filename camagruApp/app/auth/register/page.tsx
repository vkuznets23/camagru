'use client'

import styles from '@/styles/Register.module.css'
import RegisterForm from '@/components/registration/RegisterForm'

export default function RegisterPage() {
  return (
    <div className={styles.container}>
      <RegisterForm />
    </div>
  )
}
