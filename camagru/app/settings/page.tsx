'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import React from 'react'

export default function SettingsPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '')
      setBio(session.user.bio || '')
      setImage(session.user.image || '')
    }
  }, [session?.user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/user/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, bio, image }),
    })

    if (res.ok) {
      const data = await res.json()
      setName(data?.user?.name ?? '')
      setBio(data?.user?.bio ?? '')
      setImage(data?.user?.image ?? '')
      await update()
      router.refresh()
    } else {
      alert('Failed to update.')
    }

    setLoading(false)
  }

  return (
    <div>
      <h1>Profile Settings</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <br />
        <label>
          Bio:
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
        </label>
        <br />
        <label>
          Avatar URL:
          <input value={image} onChange={(e) => setImage(e.target.value)} />
        </label>
        {image && (
          <Image
            src={image}
            alt="Avatar Preview"
            width={80}
            height={80}
            style={{ borderRadius: '50%' }}
          />
        )}
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  )
}
