import zxcvbn from 'zxcvbn'

export function validateEmail(
  email: string,
  emailAvailable: boolean | null
): string | null {
  if (!email) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format'
  if (emailAvailable === false) return 'Email is already taken'
  return null
}

export function validateUsername(
  username: string,
  usernameAvailable: boolean | null
): string | null {
  if (!username) return 'Username is required'
  if (username.length < 3) return 'Username must be at least 3 characters'
  if (username.length > 20) return 'Username must be max 20 characters'
  if (!/^(?=.*[a-zA-Z])[a-zA-Z0-9_-]{3,20}$/.test(username))
    return 'Username must be 3-20 characters and contain at least one letter'
  if (usernameAvailable === false) return 'Username is already taken'
  return null
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Password must be at least 8 characters'
  if (password.length > 128) return 'Password is too long'
  if (
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[!@#$%^&*]/.test(password)
  )
    return 'Password must include uppercase, lowercase, number, and symbol'
  return null
}

export function checkPasswordStrength(pw: string) {
  return zxcvbn(pw).score
}
