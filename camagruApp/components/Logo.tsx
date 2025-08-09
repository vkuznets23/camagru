import Image from 'next/image'

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
          src="/assets/LogoCamagru.svg"
          alt="camagru logo"
          width={width}
          height={height}
          className={className}
          priority
        />
      ) : (
        <Image
          src="/assets/LogoCamagru2.svg"
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
