import styles from '@/styles/Register.module.css'
import Logo from './Logo'

interface LogoProps {
  className?: string
  text?: string
  mode?: 'dark' | 'light'
}

export default function RegisterLogo({ text, className, mode }: LogoProps) {
  return (
    <>
      <Logo className={className} mode={mode} />
      <p className={styles.heading}>{text}</p>
    </>
  )
}
