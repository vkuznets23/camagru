'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/MobileSearch.module.css'
import { type User } from '@/types/user'

export default function MobileSearchPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<User[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim().length > 1) {
        fetch(`/api/search-users?query=${encodeURIComponent(search)}`)
          .then((res) => res.json())
          .then((data) => {
            setResults(data.users || [])
            setShowDropdown(true)
          })
          .catch(() => setShowDropdown(false))
      } else {
        setResults([])
        setShowDropdown(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [search])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      const query = encodeURIComponent(search)
      setShowDropdown(false)
      router.push(`/search?query=${query}`)
    }
  }

  return (
    <div className={styles.mobileSearchPage}>
      <header className={styles.header}>
        <form onSubmit={handleSubmit} className={styles.searchForm}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search accounts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
            className={styles.searchInput}
          />
        </form>
      </header>

      {showDropdown && (
        <ul className={styles.searchDropdown}>
          {results.length > 0 ? (
            results.map((user) => (
              <li key={user.id} className={styles.searchDropdownItem}>
                <Link
                  href={`/user/${user.id}`}
                  onClick={() => {
                    setShowDropdown(false)
                    setSearch('')
                  }}
                  className={styles.searchDropdownLink}
                >
                  <Image
                    src={user.image || '/default_avatar.png'}
                    alt={user.username}
                    width={40}
                    height={40}
                    className={styles.searchAvatar}
                    priority
                  />
                  <span>{user.username}</span>
                </Link>
              </li>
            ))
          ) : (
            <p className={styles.noResults}>No results found</p>
          )}
        </ul>
      )}
    </div>
  )
}
