'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function AddPost({ onPostAdded }: { onPostAdded?: () => void }) {
  const { data: session } = useSession()
  const [content, setContent] = useState('')
  const [image, setImage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    if (!session?.user?.id) {
      alert('You must be logged in')
      return
    }

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        image: image || undefined,
        userId: session.user.id,
      }),
    })

    if (res.ok) {
      setContent('')
      setImage('')
      if (onPostAdded) onPostAdded()
    } else {
      alert('Failed to add post')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        required
        style={{ width: '100%', resize: 'vertical' }}
      />
      <input
        type="text"
        placeholder="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        style={{ width: '100%', marginTop: '0.5rem' }}
      />
      <button type="submit" style={{ marginTop: '0.5rem' }}>
        Post
      </button>
    </form>
  )
}
