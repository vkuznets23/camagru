import React from 'react'
import styles from '../verify-email/Verify-email.module.css'
import Link from 'next/link'

export default function CheckEmail() {
  return (
    <div className={styles.bg}>
      <div className={styles.container}>
        <h2>Thank you for registering!</h2>
        <p>
          Please check your email and follow the link to confirm your email
          address.
        </p>
        <p>
          If you didn’t receive the email, check your spam folder or{' '}
          <Link href="/auth/register">sign up again</Link>
        </p>
      </div>
    </div>
  )
}
