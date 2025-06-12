'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Logo from './Logo'
import Link from 'next/link'
import Image from 'next/image'
import TextInput from './TextInput'
import styles from '@/styles/Navbar.module.css'
import { useSession } from 'next-auth/react'
import SignoutButton from './SignoutButton'

export default function Navbar() {
  const { data: session } = useSession()
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)

  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/search?query=${encodeURIComponent(search)}`)
    }
  }

  const toggleMenu = () => setIsOpen(!isOpen)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  })

  const userId = session?.user?.id

  return (
    <nav id="navbar" data-testid="navbar" className={styles.navbar}>
      <Logo className={styles.logo} />
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <TextInput
          id="search"
          data-testid="search"
          placeholder="Search accounts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>
      <div className={styles.navActions}>
        <Link href="/post/create" className={styles.navBtn}>
          Add
        </Link>

        <div ref={menuRef} className={styles.menuContainer}>
          <button onClick={toggleMenu} className={styles.toggleBtn}>
            <Image
              src={session?.user?.image || '/default_avatar.png'}
              alt="Profile photo"
              width={32}
              height={32}
              className={styles.avatar}
            />
          </button>
          {isOpen && (
            <div className={styles.dropdown}>
              <Link href={`/user/${userId}`} className={styles.navBtn}>
                Profile
              </Link>
              <Link href="/settings" className={styles.navBtn}>
                Settings
              </Link>
              <SignoutButton />
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
