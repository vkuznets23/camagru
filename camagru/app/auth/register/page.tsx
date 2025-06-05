'use client'

import { useState } from 'react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    })

    const data = await res.json()
    if (res.ok) {
      setMessage('User registered! You can now sign in.')
    } else {
      setMessage(data.error || 'Something went wrong')
    }
  }

  return (
    <>
      <p>signup to see photos and videos from your friends.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">
          <input
            id="email"
            data-testid="email"
            type="email"
            placeholder="email adress"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <label htmlFor="username">
          <input
            id="username"
            data-testid="username"
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <br />
        <label htmlFor="password">
          <input
            id="password"
            data-testid="password"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        <br />
        <button type="submit">Register</button>
        <p>{message}</p>
      </form>
    </>
  )
}
