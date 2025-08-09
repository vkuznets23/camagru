'use client'

// icons import
import { GrFormAdd } from 'react-icons/gr'
import { GoHome } from 'react-icons/go'
import { GoHomeFill } from 'react-icons/go'

// component
import Logo from '../Logo'
import Link from 'next/link'
import styles from '@/styles/Navbar.module.css'
import SearchForm from './SearchForm'
import UserMenu from './UserMenu'
import DarkModeToggle from '../DarkModeToggle'

// hooks
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/context/DarkModeContext'

export default function Navbar() {
  const { theme } = useTheme()

  const { data: session } = useSession()
  const id = session?.user?.id

  const pathname = usePathname()

  const isFeedActive = pathname === '/feed'
  const isCreatePostActive = pathname === '/post/create'

  // feed icons
  const FeedActiveIcon = <GoHomeFill className={styles.activeIcon} />
  const FeedInactiveIcons = (
    <>
      <GoHomeFill className={styles.feedBtn} />
      <GoHome className={styles.goFeedBtn} />
    </>
  )

  // create post
  const CreatePostActiveIcon = <GrFormAdd className={styles.activeAddIcon} />
  const CreatePostInactiveIcons = (
    <>
      <GrFormAdd className={styles.addBtn} />
      <GrFormAdd className={styles.goAddBtn} />
    </>
  )

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
            {isFeedActive ? FeedActiveIcon : FeedInactiveIcons}
          </Link>
          <Link
            href="/post/create"
            aria-current={isCreatePostActive ? 'page' : undefined}
            className={styles.addLink}
          >
            {isCreatePostActive
              ? CreatePostActiveIcon
              : CreatePostInactiveIcons}
          </Link>

          <DarkModeToggle />
          <UserMenu />
        </div>
      </nav>
      <div className={styles.divider} />
    </>
  )
}
