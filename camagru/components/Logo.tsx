import Image from 'next/image'
import styles from '@/styles/Register.module.css'

export default function Logo({
  className,
  text,
}: {
  className?: string
  text?: string
}) {
  return (
    <>
      <Image
        src="/camagru_logo.png"
        alt="camagru logo"
        width={260}
        height={60}
        className={className}
      />
      <p className={styles.heading}>
        {text} to see photos and videos from your friends
      </p>
    </>
  )
}
