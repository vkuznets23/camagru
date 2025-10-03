'use client'

// icons import
import { GrFormAdd } from 'react-icons/gr'
import { GoHome } from 'react-icons/go'
import { GoHomeFill } from 'react-icons/go'
import { IoChatbubbleOutline, IoChatbubble } from 'react-icons/io5'

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
import { useUnreadCount } from '@/contexts/UnreadCountContext'

export default function Navbar() {
  const { theme } = useTheme()

  const { data: session } = useSession()
  const id = session?.user?.id
  const { unreadCount } = useUnreadCount()

  const pathname = usePathname()

  const isFeedActive = pathname === '/feed'
  const isCreatePostActive = pathname === '/post/create'
  const isChatActive =
    pathname === '/chat' || (pathname && pathname.startsWith('/chat/'))

  // feed icons
  const FeedActiveIcon = <GoHomeFill className={styles.activeIcon} role="img" />
  const FeedInactiveIcons = (
    <>
      <GoHomeFill className={styles.feedBtn} role="img" />
      <GoHome className={styles.goFeedBtn} role="img" />
    </>
  )

  // create post
  const CreatePostActiveIcon = <GrFormAdd className={styles.activeAddIcon} />
  const CreatePostInactiveIcons = (
    <>
      <GrFormAdd className={styles.addBtn} role="img" />
      <GrFormAdd className={styles.goAddBtn} role="img" />
    </>
  )

  // chat icons
  const ChatActiveIcon = <IoChatbubble className={styles.activeChatIcon} />
  const ChatInactiveIcons = (
    <>
      <IoChatbubbleOutline className={styles.chatBtn} role="img" />
      <IoChatbubble className={styles.goChatBtn} role="img" />
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
          <Link
            href="/chat"
            aria-current={isChatActive ? 'page' : undefined}
            aria-label="chat"
            className={styles.chatLink}
          >
            {isChatActive ? ChatActiveIcon : ChatInactiveIcons}
            {unreadCount > 0 && (
              <span className={styles.unreadBadge}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
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
