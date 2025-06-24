import Image from 'next/image'
import styles from '@/styles/Register.module.css'

interface LogoProps {
  className?: string
  text?: string
  width?: number
  height?: number
}

export default function Logo({
  className,
  text,
  width = 180,
  height = 60,
}: LogoProps) {
  return (
    <>
      <Image
        src="/camagru_logo.png"
        alt="camagru logo"
        width={width}
        height={height}
        className={className}
        priority
      />
      <p className={styles.heading}>{text}</p>
    </>
  )
}
