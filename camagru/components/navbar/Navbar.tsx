'use client'

import { GrFormAdd } from 'react-icons/gr'
import Logo from '../Logo'
import Link from 'next/link'
import styles from '@/styles/Navbar.module.css'
import SearchForm from './SearchForm'
import UserMenu from './UserMenu'

export default function Navbar() {
  return (
    <>
      <nav id="navbar" data-testid="navbar" className={styles.navbar}>
        <Logo className={styles.logo} width={134} height={47} />
        <SearchForm />
        <div className={styles.navActions}>
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
