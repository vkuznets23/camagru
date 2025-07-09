'use client'

import { GrFormAdd } from 'react-icons/gr'
import { MdHomeFilled } from 'react-icons/md'
import Logo from '../Logo'
import Link from 'next/link'
import styles from '@/styles/Navbar.module.css'
import SearchForm from './SearchForm'
import UserMenu from './UserMenu'
import { useSession } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()
  const id = session?.user.id
  return (
    <>
      <nav id="navbar" data-testid="navbar" className={styles.navbar}>
        <Link href={`/user/${id}`}>
          <Logo className={styles.logo} width={134} height={47} />
        </Link>
        <div className={styles.navActions}>
          <div className={styles.searchNavbarWrapper}>
            <SearchForm />
          </div>
          <Link href="/feed">
            <MdHomeFilled className={styles.feedBtn} />
          </Link>
          <Link href="/post/create">
            <GrFormAdd className={styles.addBtn} />
          </Link>
          <UserMenu />
        </div>
      </nav>
      <div className={styles.divider} />
    </>
  )
}
