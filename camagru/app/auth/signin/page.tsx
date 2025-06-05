'use client'

import { getCsrfToken } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function SignIn() {
  const [csrfToken, setCsrfToken] = useState('')

  useEffect(() => {
    getCsrfToken().then((token) => setCsrfToken(token || ''))
  }, [])

  return (
    <form method="post" action="/api/auth/signin/email">
      <input name="csrfToken" type="hidden" value={csrfToken} />
      <label>
        Email address
        <input type="email" id="email" name="email" required />
      </label>
      <button type="submit">Sign in / Register</button>
    </form>
  )
}
