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
  const FeedActiveIcon = (
    <GoHomeFill
      role="img"
      aria-label="Go feed page"
      className={styles.activeIcon}
    />
  )
  const FeedInactiveIcons = (
    <>
      <GoHomeFill
        role="img"
        aria-label="Go feed page"
        className={styles.feedBtn}
      />
      <GoHome
        role="img"
        aria-label="Go feed page"
        className={styles.goFeedBtn}
      />
    </>
  )

  // create post
  const CreatePostActiveIcon = (
    <GrFormAdd
      role="img"
      aria-label="Create post"
      className={styles.activeAddIcon}
    />
  )
  const CreatePostInactiveIcons = (
    <>
      <GrFormAdd
        role="img"
        aria-label="Create post"
        className={styles.addBtn}
      />
      <GrFormAdd
        role="img"
        aria-label="Create post"
        className={styles.goAddBtn}
      />
    </>
  )

  const width = window.innerWidth > 820 ? 134 : 100
  const height = window.innerWidth > 820 ? 47 : 36

  return (
    <>
      <nav
        id="navbar"
        data-testid="navbar"
        className={styles.navbar}
        role="navigation"
        aria-label="main navigation"
      >
        <Link href={`/user/${id}`} aria-label="go to profile page">
          <Logo
            className={styles.logo}
            width={width}
            height={height}
            mode={theme}
          />
        </Link>
        <div className={styles.searchNavbarWrapper}>
          <SearchForm />
        </div>
        <div className={styles.navActions}>
          <Link
            href="/feed"
            aria-current={isFeedActive ? 'page' : undefined}
            aria-label="feed"
            className={styles.feedLink}
          >
            {isFeedActive ? FeedActiveIcon : FeedInactiveIcons}
          </Link>
          <Link
            href="/post/create"
            aria-current={isCreatePostActive ? 'page' : undefined}
            aria-label="create post"
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
