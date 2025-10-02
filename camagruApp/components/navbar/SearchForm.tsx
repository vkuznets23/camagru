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
  const [history, setHistory] = useState<User[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('searchHistory')
  }

  const removeFromHistory = (id: string) => {
    const updated = history.filter((h) => h.id !== id)
    setHistory(updated)
    localStorage.setItem('searchHistory', JSON.stringify(updated))
  }

  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
        setShowHistory(false)
        setIsExpanded(false)
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
    if (e.key === 'Tab') {
      return
    }

    const currentList = showHistory ? history : results
    const isHistoryActive = showHistory && history.length > 0

    if (!showDropdown && !isHistoryActive) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (isHistoryActive) {
        setActiveIndex((prev) => (prev + 1) % history.length)
      } else {
        setActiveIndex((prev) => (prev + 1) % results.length)
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (isHistoryActive) {
        setActiveIndex((prev) => (prev - 1 + history.length) % history.length)
      } else {
        setActiveIndex((prev) => (prev - 1 + results.length) % results.length)
      }
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && activeIndex < currentList.length) {
        const user = currentList[activeIndex]
        if (isHistoryActive) {
          setShowHistory(false)
          setShowDropdown(false)
          setIsExpanded(false)
          setSearch('')
          const active = document.activeElement as HTMLElement | null
          if (active?.blur) active.blur()
        } else {
          setHistory(
            [...history.filter((h) => h.id !== user.id), user].slice(-10)
          )
          setShowDropdown(false)
          setShowHistory(false)
          setIsExpanded(false)
          setSearch('')
          const active = document.activeElement as HTMLElement | null
          if (active?.blur) active.blur()
        }
        router.push(`/user/${user.id}`)
      } else {
        handleSubmit(e)
      }
    }
  }

  return (
    <div ref={dropdownRef} className={styles.searchWrapper}>
      <form
        onSubmit={handleSubmit}
        className={`${styles.searchForm} ${isExpanded ? styles.expanded : ''}`}
      >
        <TextInput
          id="search"
          data-testid="search"
          placeholder="Search accounts..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            if (e.target.value.trim()) {
              setShowHistory(false)
              setActiveIndex(-1)
            }
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          onFocus={() => setIsExpanded(true)}
          onBlur={(e) => {
            const relatedTarget = e.relatedTarget as HTMLElement
            if (relatedTarget && dropdownRef.current?.contains(relatedTarget)) {
              return
            }
            setIsExpanded(false)
          }}
          onClick={() => {
            if (history.length > 0 && !search.trim()) {
              setShowHistory(true)
              setActiveIndex(-1)
            }
          }}
        />
      </form>

      {showHistory && history.length > 0 && search.trim() === '' && (
        <ul
          className={`${styles.searchDropdown} ${
            isExpanded ? styles.expanded : ''
          }`}
        >
          <div className={styles.historyHeader}>
            <h3>Recent searches</h3>
            <button
              onClick={clearHistory}
              onMouseDown={(e) => e.preventDefault()}
              className={styles.clearButton}
            >
              Clear All
            </button>
          </div>
          {history.map((user, index) => (
            <li
              key={user.id}
              className={`${styles.searchDropdownItem} ${
                index === activeIndex ? styles.activeDropdownItem : ''
              }`}
            >
              <Link
                href={`/user/${user.id}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setShowHistory(false)
                  setShowDropdown(false)
                  setIsExpanded(false)
                  setSearch('')
                  const active = document.activeElement as HTMLElement | null
                  if (active?.blur) active.blur()
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
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  removeFromHistory(user.id)
                }}
                className={styles.removeButton}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {showDropdown && (
        <ul
          className={`${styles.searchDropdown} ${
            isExpanded ? styles.expanded : ''
          }`}
        >
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
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setHistory(
                      [...history.filter((h) => h.id !== user.id), user].slice(
                        -10
                      )
                    )
                    setShowDropdown(false)
                    setShowHistory(false)
                    setIsExpanded(false)
                    setSearch('')
                    const active = document.activeElement as HTMLElement | null
                    if (active?.blur) active.blur()
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
