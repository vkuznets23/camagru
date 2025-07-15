import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RegisterForm from '@/components/registration/RegisterForm'
import PasswordStrengthBar from '@/components/PasswordStrengthBar'
import { ThemeProvider } from '@/context/DarkModeContext'

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>)
}

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

describe('Basic RegisterForm tests', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(true),
      })
    ) as jest.Mock
  })
  beforeAll(() => {
    window.matchMedia =
      window.matchMedia ||
      function () {
        return {
          matches: false,
          addListener: () => {},
          removeListener: () => {},
        }
      }
  })

  it('renders inputs and buttons', () => {
    renderWithProviders(<RegisterForm />)

    expect(screen.queryByTestId('navbar')).not.toBeInTheDocument()

    expect(screen.getByTestId('email')).toBeInTheDocument()
    expect(screen.getByTestId('password')).toBeInTheDocument()
    expect(screen.getByTestId('username')).toBeInTheDocument()
    expect(screen.getByTestId('register-button')).toBeInTheDocument()
    expect(screen.getByTestId('toggle-btn')).toBeInTheDocument()
    expect(screen.getByText('Already have an account?')).toBeInTheDocument()
  })
  it('toggle password visibility when clicking toggle button', async () => {
    renderWithProviders(<RegisterForm />)

    const passwordInput = screen.getByTestId('password')
    const toggleButton = screen.getByTestId('toggle-btn')

    expect(passwordInput).toHaveAttribute('type', 'password')

    await userEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')

    await userEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('renders PasswordStrengthBar', () => {
    const { rerender } = render(<PasswordStrengthBar strength={0} />)
    let bar = screen.getByTestId('strength-bar')
    expect(bar).toHaveClass('weak')

    rerender(<PasswordStrengthBar strength={1} />)
    bar = screen.getByTestId('strength-bar')
    expect(bar).toHaveClass('fair')

    rerender(<PasswordStrengthBar strength={2} />)
    bar = screen.getByTestId('strength-bar')
    expect(bar).toHaveClass('medium')

    rerender(<PasswordStrengthBar strength={3} />)
    bar = screen.getByTestId('strength-bar')
    expect(bar).toHaveClass('good')

    rerender(<PasswordStrengthBar strength={4} />)
    bar = screen.getByTestId('strength-bar')
    expect(bar).toHaveClass('strong')
  })

  it('shows validation errors when submitting empty form and submit button is disabled', async () => {
    renderWithProviders(<RegisterForm />)

    const submitButton = screen.getByTestId('register-button')
    expect(submitButton).toBeDisabled()

    submitButton.removeAttribute('disabled')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByTestId('email-error')).toHaveTextContent(
        'Email is required'
      )
      expect(screen.getByTestId('username-error')).toHaveTextContent(
        'Username is required'
      )
      expect(screen.getByTestId('password-error')).toHaveTextContent(
        'Password is required'
      )
    })
  })

  it('submit button is actuve when fields are filled', async () => {
    renderWithProviders(<RegisterForm />)

    const emailInput = screen.getByTestId('email')
    const usernameInput = screen.getByTestId('username')
    const passwordInput = screen.getByTestId('password')
    const submitButton = screen.getByTestId('register-button')

    await userEvent.type(emailInput, 'username@g,ail.com')
    await userEvent.type(usernameInput, 'username')
    await userEvent.type(passwordInput, 'StrongPass!1234')

    expect(submitButton).not.toBeDisabled()
  })

  it('shows validation errors when submitting invalid email', async () => {
    renderWithProviders(<RegisterForm />)

    const emailInput = screen.getByTestId('email')
    const usernameInput = screen.getByTestId('username')
    const passwordInput = screen.getByTestId('password')
    const submitButton = screen.getByTestId('register-button')

    await userEvent.type(emailInput, 'invalid')
    await userEvent.type(usernameInput, 'validUsername')
    await userEvent.type(passwordInput, 'StrongPass!1234')

    expect(submitButton).toBeDisabled() // cos if we have error btn is still disabled

    await waitFor(() => {
      expect(screen.getByTestId('email-error')).toHaveTextContent(
        /invalid email/i
      )
    })
  })

  describe('shows validation errors when submitting invalid username', () => {
    it('short username', async () => {
      renderWithProviders(<RegisterForm />)

      const emailInput = screen.getByTestId('email')
      const usernameInput = screen.getByTestId('username')
      const passwordInput = screen.getByTestId('password')
      const submitButton = screen.getByTestId('register-button')

      await userEvent.type(emailInput, 'user@gmail.com')
      await userEvent.type(usernameInput, 'a')
      await userEvent.type(passwordInput, 'StrongPass!1234')

      expect(submitButton).toBeDisabled()

      await waitFor(() => {
        expect(screen.getByTestId('username-error')).toHaveTextContent(
          'Username must be at least 3 characters'
        )
      })
    })

    it('long username', async () => {
      renderWithProviders(<RegisterForm />)

      const emailInput = screen.getByTestId('email')
      const usernameInput = screen.getByTestId('username')
      const passwordInput = screen.getByTestId('password')
      const submitButton = screen.getByTestId('register-button')

      await userEvent.type(emailInput, 'user@gmail.com')
      await userEvent.type(usernameInput, 'aaaaaaaaaaaaaaaaaaaaaa')
      await userEvent.type(passwordInput, 'StrongPass!1234')

      expect(submitButton).toBeDisabled()

      await waitFor(() => {
        expect(screen.getByTestId('username-error')).toHaveTextContent(
          'Username must be max 20 characters'
        )
      })
    })

    it('extra characters in username', async () => {
      renderWithProviders(<RegisterForm />)

      const emailInput = screen.getByTestId('email')
      const usernameInput = screen.getByTestId('username')
      const passwordInput = screen.getByTestId('password')
      const submitButton = screen.getByTestId('register-button')

      await userEvent.type(emailInput, 'user@gmail.com')
      await userEvent.type(usernameInput, 'aaa#')
      await userEvent.type(passwordInput, 'StrongPass!1234')

      expect(submitButton).toBeDisabled() // cos if we have error btn is still disabled

      await waitFor(() => {
        expect(screen.getByTestId('username-error')).toHaveTextContent(
          'Username must be 3–20 characters, include a letter, and use only letters, numbers, ., _, or -'
        )
      })
    })
  })

  describe('taken email/user tests', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })

    it('shows error when email is already taken', async () => {
      const mockFetch = jest.fn((url) => {
        if (url.includes('check-email')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ available: false }),
          } as unknown as Response)
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ available: true }),
        } as unknown as Response)
      })
      global.fetch = mockFetch
      renderWithProviders(<RegisterForm />)

      const emailInput = screen.getByTestId('email')
      const usernameInput = screen.getByTestId('username')
      const passwordInput = screen.getByTestId('password')
      const submitButton = screen.getByTestId('register-button')

      await userEvent.type(emailInput, 'existing@example.com')
      await userEvent.type(usernameInput, 'validusername')
      await userEvent.type(passwordInput, 'ValidPass123!')

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('existing%40example.com')
        )
      })

      await waitFor(() => {
        expect(screen.getByTestId('email-error')).toBeInTheDocument()
        expect(screen.getByTestId('email-error')).toHaveTextContent(
          'Email is already taken'
        )
      })

      expect(submitButton).toBeDisabled()
    })
    it('shows error when user is already taken', async () => {
      const mockFetch = jest.fn((url) => {
        if (url.includes('check-username')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ available: false }),
          } as unknown as Response)
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ available: true }),
        } as unknown as Response)
      })
      global.fetch = mockFetch
      renderWithProviders(<RegisterForm />)

      const emailInput = screen.getByTestId('email')
      const usernameInput = screen.getByTestId('username')
      const passwordInput = screen.getByTestId('password')
      const submitButton = screen.getByTestId('register-button')

      await userEvent.type(emailInput, 'validemail@example.com')
      await userEvent.type(usernameInput, 'existinguser')
      await userEvent.type(passwordInput, 'ValidPass123!')

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('existinguser')
        )
      })

      await waitFor(() => {
        expect(screen.getByTestId('username-error')).toBeInTheDocument()
        expect(screen.getByTestId('username-error')).toHaveTextContent(
          'Username is already taken'
        )
      })

      expect(submitButton).toBeDisabled()
    })
  })
})
