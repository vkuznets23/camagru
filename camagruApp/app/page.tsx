'use client'

import SignInForm from '@/components/registration/SigninForm'
import styles from './page.module.css'
import Image from 'next/image'
import { useTheme } from '@/context/DarkModeContext'

export default function Home() {
  const { theme } = useTheme()
  return (
    <div className={styles.fullscreenCenter}>
      <div className={styles.container}>
        <div className={styles.imageWrapper}>
          <Image
            src="/instagram.png"
            alt="instagram"
            width={600}
            height={430}
            style={{
              maxWidth: '100%',
              height: 'auto',
              opacity: theme === 'dark' ? 0.7 : 1,
              transition: 'opacity 0.3s ease',
            }}
          />
        </div>
        <div className={styles.formWrapper}>
          <SignInForm />
        </div>
      </div>
    </div>
  )
}
