'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import SignoutButton from '../SignoutButton'
import styles from '@/styles/Navbar.module.css'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

export default function UserMenu() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const userId = session?.user?.id

  const toggleMenu = () => setIsOpen(!isOpen)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const pathname = usePathname()
  const isUserActive = pathname === `/user/${userId}`

  return (
    <div ref={menuRef} className={styles.menuContainer}>
      <button onClick={toggleMenu} className={styles.toggleBtn}>
        <div
          className={`${styles.avatarWrapper} ${
            isUserActive ? styles.avatarWrapperActive : ''
          }`}
        >
          <Image
            src={session?.user?.image || '/default_avatar.png'}
            alt="Avatar"
            width={32}
            height={32}
            className={styles.avatar}
          />
        </div>
      </button>
      {isOpen && (
        <div className={styles.dropdown}>
          <Link
            href={`/user/${userId}`}
            className={styles.navBtn}
            onClick={() => setIsOpen(false)}
          >
            Profile
          </Link>
          <Link
            href="/settings"
            className={styles.navBtn}
            onClick={() => setIsOpen(false)}
          >
            Settings
          </Link>
          <SignoutButton />
        </div>
      )}
    </div>
  )
}
