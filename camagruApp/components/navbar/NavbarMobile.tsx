import Link from 'next/link'
import { MdHomeFilled } from 'react-icons/md'
import { GoHome } from 'react-icons/go'
import { GrFormAdd } from 'react-icons/gr'
import Image from 'next/image'
import styles from '@/styles/MobileNavbar.module.css'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import DarkModeToggle from '../DarkModeToggle'
import { MdSearch } from 'react-icons/md'

export default function MobileNavbar() {
  const { data: session } = useSession()
  const id = session?.user.id

  const pathname = usePathname()

  const isFeedActive = pathname === '/feed'
  const isUserActive = pathname === `/user/${id}`
  const isSearchActive = pathname === '/search'

  return (
    <div>
      <nav
        id="navbarMobile"
        data-testid="navbarMobile"
        className={styles.mobileNavbar}
      >
        <div className={styles.navActions}>
          <Link href="/feed" aria-current={isFeedActive ? 'page' : undefined}>
            {isFeedActive ? (
              <MdHomeFilled className={styles.feedBtn} />
            ) : (
              <GoHome className={styles.feedBtn} />
            )}
          </Link>
          <Link
            href="/search"
            aria-current={isSearchActive ? 'page' : undefined}
          >
            <MdSearch
              className={
                isSearchActive ? styles.searchBtnActive : styles.searchBtn
              }
            />
          </Link>
          <Link href="/post/create">
            <GrFormAdd className={styles.addBtn} />
          </Link>
          <DarkModeToggle />
          <Link
            href={`/user/${id}`}
            aria-current={isUserActive ? 'page' : undefined}
          >
            <div className={isUserActive ? styles.avatarWrapper : ''}>
              <Image
                src={session?.user?.image || '/default_avatar.png'}
                alt="Avatar"
                width={32}
                height={32}
                className={isUserActive ? styles.avatarActive : styles.avatar}
              />
            </div>
          </Link>
        </div>
      </nav>
    </div>
  )
}
