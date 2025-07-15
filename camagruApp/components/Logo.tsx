import Image from 'next/image'
import logoDark from '@/assets/LogoCamagru2.svg'
import logoLight from '@/assets/LogoCamagru.svg'

interface LogoProps {
  className?: string
  width?: number
  height?: number
  mode?: 'dark' | 'light'
}

export default function Logo({
  className,
  width = 172,
  height = 48,
  mode,
}: LogoProps) {
  return (
    <>
      {mode == 'light' ? (
        <Image
          src={logoLight}
          alt="camagru logo"
          width={width}
          height={height}
          className={className}
          priority
        />
      ) : (
        <Image
          src={logoDark}
          alt="camagru logo"
          width={width}
          height={height}
          className={className}
          priority
        />
      )}
    </>
  )
}
