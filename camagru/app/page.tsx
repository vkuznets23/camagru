import SignInForm from '@/components/SigninForm'
import styles from './page.module.css'
import Image from 'next/image'

export default function Home() {
  return (
    <div className={styles.fullscreenCenter}>
      <div className={styles.container}>
        <div className={styles.imageWrapper}>
          <Image
            src="/instagram.png"
            alt="instagram"
            width={590}
            height={420}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
        <div className={styles.formWrapper}>
          <SignInForm />
        </div>
      </div>
    </div>
  )
}
