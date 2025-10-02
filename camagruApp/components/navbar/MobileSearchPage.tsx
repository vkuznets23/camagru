'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import styles from '@/styles/MobileSearch.module.css'
import { type User } from '@/types/user'
import UserList, { FollowerPreview } from '../UserList'
import { useSession } from 'next-auth/react'
import { IoCloseOutline } from 'react-icons/io5'

export type HistoryItem = {
  id: string
  username: string
  name?: string | null
  image?: string | null
  bio?: string | null
}

type ListUser = User | HistoryItem | FollowerPreview

export default function MobileSearchPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const id = session?.user?.id

  const [search, setSearch] = useState('')
  const [results, setResults] = useState<ListUser[]>([])
  const [history, setHistory] = useState<ListUser[]>([])
  const [showDropdown, setShowDropdown] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  // loading LocalStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory')
    if (savedHistory) setHistory(JSON.parse(savedHistory) || [])
  }, [])

  // Redirection on desktop
  useEffect(() => {
    if (window.innerWidth > 820) {
      if (id) {
        router.replace(`/user/${id}`)
      } else {
        router.replace('/feed')
      }
    }
  }, [id, router])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // showing user with debounce
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

  const saveToHistory = (user: ListUser) => {
    const newItem: HistoryItem = {
      id: user.id,
      username: user.username,
      name: user.name ?? null,
      image: user.image ?? null,
      bio: user.bio ?? null,
    }

    const updated = [newItem, ...history.filter((h) => h.id !== user.id)].slice(
      0,
      10
    )
    setHistory(updated)
    localStorage.setItem('searchHistory', JSON.stringify(updated))
  }

  const handleUserClick = (user: ListUser) => {
    saveToHistory(user)
    setShowDropdown(false)
    router.push(`/user/${user.id}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const query = search.trim()
    if (!query) return

    setShowDropdown(false)
    router.push(`/search?query=${encodeURIComponent(query)}`)
  }

  const removeFromHistory = (id: string) => {
    const updated = history.filter((h) => h.id !== id)
    setHistory(updated)
    localStorage.setItem('searchHistory', JSON.stringify(updated))
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('searchHistory')
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

      {history.length > 0 && search.trim() === '' && (
        <div className={styles.historyContainer}>
          <div className={styles.historyHeader}>
            <h3>Recent searches</h3>
            <button onClick={clearHistory} className={styles.clearButton}>
              Clear All
            </button>
          </div>
          <UserList
            users={history}
            emptyMessage="No recent searches"
            noPadding={true}
            onUserClick={handleUserClick}
            renderExtra={(user: HistoryItem) => (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeFromHistory(user.id)
                }}
                className={styles.removeButton}
              >
                <IoCloseOutline />
              </button>
            )}
          />
        </div>
      )}

      {showDropdown && (
        <UserList
          users={results}
          emptyMessage="No results"
          noPadding={true}
          onUserClick={handleUserClick}
        />
      )}
    </div>
  )
}
