'use client'

import React, { useState } from 'react'
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
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/search?query=${encodeURIComponent(search)}`)
    }
  }

  const userId = session?.user?.id
  console.log(session)

  return (
    <nav className={styles.navbar}>
      <Logo />
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <TextInput
          id="search"
          testdataid="search"
          placeholder="Search accounts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>
      <div className={styles.navActions}>
        <Link href="/post/create" className={styles.navBtn}>
          Add
        </Link>
        <Link href="/settings" className={styles.navBtn}>
          Settings
        </Link>
        <SignoutButton />
        {userId && (
          <Link href={`/user/${userId}`} className={styles.avatarLink}>
            <Image
              src={session?.user?.image || '/default_avatar.png'}
              alt="Profile photo"
              width={32}
              height={32}
              className={styles.avatar}
            />
          </Link>
        )}
      </div>
    </nav>
  )
}
