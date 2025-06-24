'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import TextInput from '../TextInput'
import styles from '@/styles/Navbar.module.css'

export default function SearchForm() {
  const router = useRouter()
  const [search, setSearch] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/search?query=${encodeURIComponent(search)}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className={styles.searchForm}>
      <TextInput
        id="search"
        data-testid="search"
        placeholder="Search accounts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </form>
  )
}
