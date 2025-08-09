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
  const src =
    mode === 'light' ? '/assets/LogoCamagru.svg' : '/assets/LogoCamagru2.svg'

  return (
    <>
      {mode == 'light' ? (
        <Image
          src={src}
          alt="camagru logo"
          width={width}
          height={height}
          className={className}
          priority
        />
      ) : (
        <Image
          src={src}
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
