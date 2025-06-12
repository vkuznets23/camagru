import {
  validateEmail,
  validateUsername,
  validatePassword,
  checkPasswordStrength,
} from '@/utils/formValidations'

// EMAIL
describe('validateEmail', () => {
  it('returns error if email is empty', () => {
    expect(validateEmail('', null)).toBe('Email is required')
  })

  it('returns error if email format is invalid', () => {
    expect(validateEmail('not-an-email', null)).toBe('Invalid email format')
  })

  it('returns error if email is taken', () => {
    expect(validateEmail('test@example.com', false)).toBe(
      'Email is already taken'
    )
  })

  it('returns null for valid and available email', () => {
    expect(validateEmail('test@example.com', true)).toBeNull()
  })
})

// USERNAME
describe('validateUsername', () => {
  it('returns error if username is empty', () => {
    expect(validateUsername('', null)).toBe('Username is required')
  })

  it('returns error if username is too short', () => {
    expect(validateUsername('ab', null)).toBe(
      'Username must be at least 3 characters'
    )
  })

  it('returns error if username is too long', () => {
    expect(validateUsername('a'.repeat(21), null)).toBe(
      'Username must be max 20 characters'
    )
  })

  it('returns error if username has invalid characters', () => {
    expect(validateUsername('$$$', null)).toMatch(/must be 3–20 characters/)
  })

  it('returns error if username is taken', () => {
    expect(validateUsername('validUser', false)).toBe(
      'Username is already taken'
    )
  })

  it('returns null for valid and available username', () => {
    expect(validateUsername('validUser_123', true)).toBeNull()
  })
})

// PASSWORD
describe('validatePassword', () => {
  it('returns error if password is empty', () => {
    expect(validatePassword('')).toBe('Password is required')
  })

  it('returns error if password is too short', () => {
    expect(validatePassword('Ab1!')).toBe(
      'Password must be at least 8 characters'
    )
  })

  it('returns error if password is too long', () => {
    expect(validatePassword('A1a!'.repeat(40))).toBe('Password is too long')
  })

  it('returns error if missing lowercase', () => {
    expect(validatePassword('PASSWORD1!')).toBe(
      'Password must include uppercase, lowercase, number, and symbol'
    )
  })

  it('returns error if missing uppercase', () => {
    expect(validatePassword('password1!')).toBe(
      'Password must include uppercase, lowercase, number, and symbol'
    )
  })

  it('returns error if missing number', () => {
    expect(validatePassword('Password!')).toBe(
      'Password must include uppercase, lowercase, number, and symbol'
    )
  })

  it('returns error if missing symbol', () => {
    expect(validatePassword('Password1')).toBe(
      'Password must include uppercase, lowercase, number, and symbol'
    )
  })

  it('returns null for a strong valid password', () => {
    expect(validatePassword('StrongPass1!')).toBeNull()
  })
})

// PASSWORD STRENGTH
describe('checkPasswordStrength', () => {
  it('returns a strength score between 0 and 4', () => {
    const weak = checkPasswordStrength('123')
    const medium = checkPasswordStrength('Pass123!')
    const strong = checkPasswordStrength('VeryStrongPassword123!')

    expect(weak).toBeGreaterThanOrEqual(0)
    expect(weak).toBeLessThanOrEqual(4)
    expect(medium).toBeGreaterThanOrEqual(0)
    expect(strong).toBeGreaterThanOrEqual(0)
  })
})
