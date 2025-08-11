'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import styles from '@/styles/MobileSearch.module.css'
import { type User } from '@/types/user'
import UserList from '../UserList'
import { useSession } from 'next-auth/react'

export default function MobileSearchPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<User[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { data: session } = useSession()

  const id = session?.user?.id

  useEffect(() => {
    if (window.innerWidth > 820) {
      router.replace(`/user/${id}`)
    }
  }, [id, router])

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
        <UserList users={results} emptyMessage="No results" noPadding={true} />
      )}
    </div>
  )
}
