'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import TextInput from '../TextInput'
import styles from '@/styles/Navbar.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { type User } from '@/types/user'

export default function SearchForm() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<User[]>([])
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim().length > 1) {
        fetch(`/api/search-users?query=${encodeURIComponent(search)}`)
          .then((res) => res.json())
          .then((data) => {
            setResults(data.users || [])
            setShowDropdown(true)
          })
          .catch((err) => {
            console.error('Search error:', err)
            setShowDropdown(false)
          })
      } else {
        setResults([])
        setShowDropdown(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [search])

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault()
  //   if (search.trim()) {
  //     router.push(`/search?query=${encodeURIComponent(search)}`)
  //     setSearch('')
  //     setShowDropdown(false)
  //   }
  // }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('hello')
    if (search.trim()) {
      const query = encodeURIComponent(search)
      setShowDropdown(false)
      router.push(`/search?query=${query}`)
    }
  }

  return (
    <div className={styles.searchWrapper} style={{ position: 'relative' }}>
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <TextInput
          id="search"
          data-testid="search"
          placeholder="Search accounts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoComplete="off"
        />
      </form>

      {showDropdown && results.length > 0 && (
        <ul
          className={styles.searchDropdown}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'white',
            border: '1px solid #ccc',
            zIndex: 1000,
            listStyle: 'none',
            padding: 0,
            margin: 0,
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          {results.map((user) => (
            <li
              key={user.id}
              style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}
            >
              <Link
                href={`/user/${user.id}`}
                onClick={() => {
                  setShowDropdown(false)
                  setSearch('')
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: '#333',
                }}
              >
                <Image
                  src={user.image || '/default_avatar.png'}
                  alt={user.username}
                  width={24}
                  height={24}
                  style={{ borderRadius: '50%', marginRight: '0.5rem' }}
                />
                {user.username}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
