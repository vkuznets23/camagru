'use client'

import { GrFormAdd } from 'react-icons/gr'
import { GoHome } from 'react-icons/go'
import { GoHomeFill } from 'react-icons/go'

import Logo from '../Logo'
import Link from 'next/link'
import styles from '@/styles/Navbar.module.css'
import SearchForm from './SearchForm'
import UserMenu from './UserMenu'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/context/DarkModeContext'
import DarkModeToggle from '../DarkModeToggle'

export default function Navbar() {
  const { theme } = useTheme()

  const { data: session } = useSession()
  const id = session?.user?.id

  const pathname = usePathname()

  const isFeedActive = pathname === '/feed'
  const isCreatePostActive = pathname === '/post/create'

  return (
    <>
      <nav id="navbar" data-testid="navbar" className={styles.navbar}>
        <Link href={`/user/${id}`}>
          <Logo className={styles.logo} width={134} height={47} mode={theme} />
        </Link>
        <div className={styles.navActions}>
          <div className={styles.searchNavbarWrapper}>
            <SearchForm />
          </div>
          <Link
            href="/feed"
            aria-current={isFeedActive ? 'page' : undefined}
            className={styles.feedLink}
          >
            {isFeedActive ? (
              <GoHomeFill className={styles.activeIcon} />
            ) : (
              <>
                <GoHomeFill className={styles.feedBtn} />
                <GoHome className={styles.goFeedBtn} />
              </>
            )}
          </Link>
          <Link
            href="/post/create"
            aria-current={isCreatePostActive ? 'page' : undefined}
            className={styles.addLink}
          >
            {isCreatePostActive ? (
              <GrFormAdd className={styles.activeAddIcon} />
            ) : (
              <>
                <GrFormAdd className={styles.addBtn} />
                <GrFormAdd className={styles.goAddBtn} />
              </>
            )}
          </Link>

          <DarkModeToggle />
          <UserMenu />
        </div>
      </nav>
      <div className={styles.divider} />
    </>
  )
}
