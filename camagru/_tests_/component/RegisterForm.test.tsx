import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RegisterForm from '@/components/RegisterForm'
import PasswordStrengthBar from '@/components/PasswordStrengthBar'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

//tests:
// form rendering (username / email / password fields appear)
// passwrodStrengthBar appears
// toggle button behavior
// errors with bad inputs (weak password / invalid email / invalid username)
// sign up button disabled when form is empty / activ ewhen all fields are filled

// debounce
// check that redirect happends
// user is taken / email is taken

describe('RegisterForm', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(true),
      })
    ) as jest.Mock
  })

  it('renders inputs and buttons', () => {
    render(<RegisterForm />)

    expect(screen.queryByTestId('navbar')).not.toBeInTheDocument()

    expect(screen.getByTestId('email')).toBeInTheDocument()
    expect(screen.getByTestId('password')).toBeInTheDocument()
    expect(screen.getByTestId('username')).toBeInTheDocument()
    expect(screen.getByTestId('register-button')).toBeInTheDocument()
    expect(screen.getByTestId('toggle-btn')).toBeInTheDocument()
    expect(screen.getByText('Already have an account?')).toBeInTheDocument()
  })
  it('toggle password visibility when clicking toggle button', async () => {
    render(<RegisterForm />)

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
    render(<RegisterForm />)

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
    render(<RegisterForm />)

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
    render(<RegisterForm />)

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
      render(<RegisterForm />)

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
      render(<RegisterForm />)

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
      render(<RegisterForm />)

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
})
