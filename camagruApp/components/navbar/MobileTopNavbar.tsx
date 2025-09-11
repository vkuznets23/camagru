import Link from 'next/link'
import { MdSearch } from 'react-icons/md'
import styles from '@/styles/MobileTopbar.module.css'
import { useEffect, useState } from 'react'
import Logo from '../Logo'
import { useTheme } from '@/context/DarkModeContext'
import { useSession } from 'next-auth/react'

export default function MobileTopbar() {
  const { theme } = useTheme()
  const { data: session } = useSession()
  const id = session?.user?.id

  const [show, setShow] = useState(true)
  let lastScroll = 0

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth > 820) return

      const currentScroll = window.pageYOffset

      if (currentScroll < 50) {
        setShow(true)
      } else if (currentScroll > lastScroll) {
        setShow(false)
      } else {
        setShow(true)
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
      lastScroll = currentScroll
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={styles.mobileTopbar}
      style={{
        transform: show ? 'translateY(0)' : 'translateY(-100%)',
      }}
    >
      <div className={styles.topActions}>
        <Link
          href={`/user/${id}`}
          className={styles.logo}
          aria-label="go to profile page"
        >
          <Logo width={100} height={48} mode={theme} />
        </Link>
        <Link href="/search">
          <MdSearch className={styles.searchBtn} />
        </Link>
      </div>
    </nav>
  )
}
