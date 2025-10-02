'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import TextInput from '../TextInput'
import styles from '@/styles/Navbar.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { type User } from '@/types/user'

export default function SearchForm() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [results, setResults] = useState<User[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
        setActiveIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (search.trim().length > 1) {
        try {
          const res = await fetch(
            `/api/search-users?query=${encodeURIComponent(search)}`
          )
          const data = await res.json()
          setResults(data.users || [])
          setShowDropdown(true)
          setActiveIndex(-1)
        } catch (err) {
          console.error('Search error:', err)
          setShowDropdown(false)
        }
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prev) => (prev + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && activeIndex < results.length) {
        const user = results[activeIndex]
        setShowDropdown(false)
        setSearch('')
        router.push(`/user/${user.id}`)
      } else {
        handleSubmit(e)
      }
    }
  }

  return (
    <div
      ref={dropdownRef}
      className={styles.searchWrapper}
      style={{ position: 'relative' }}
    >
      <form
        onSubmit={handleSubmit}
        className={`${styles.searchForm} ${isExpanded ? styles.expanded : ''}`}
      >
        <TextInput
          id="search"
          data-testid="search"
          placeholder="Search accounts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          onFocus={() => setIsExpanded(true)}
          onBlur={() => setIsExpanded(false)}
        />
      </form>

      {showDropdown && (
        <ul className={styles.searchDropdown}>
          {results.length > 0 ? (
            results.map((user, index) => (
              <li
                key={user.id}
                className={`${styles.searchDropdownItem} ${
                  index === activeIndex ? styles.activeDropdownItem : ''
                }`}
              >
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
                    width={24}
                    height={24}
                    className={styles.searchAvatar}
                  />
                  {user.username}
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
