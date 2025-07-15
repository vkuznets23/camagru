import { render, screen, waitFor } from '@testing-library/react'
import SignInForm from '@/components/registration/SigninForm'
import userEvent from '@testing-library/user-event'
import { signIn } from 'next-auth/react'
import { ThemeProvider } from '@/context/DarkModeContext'

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>)
}

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}))

describe('SigninForm', () => {
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

  it('render inputs and buttons', () => {
    renderWithProviders(<SignInForm />)

    expect(screen.queryByTestId('navbar')).not.toBeInTheDocument()

    expect(screen.getByTestId('password-signin')).toBeInTheDocument()
    expect(screen.getByTestId('login-signin')).toBeInTheDocument()
    expect(screen.getByTestId('toggle-btn')).toBeInTheDocument()
    expect(screen.getByTestId('signin-button')).toBeInTheDocument()
    expect(screen.getByText('Forgotten your password?')).toBeInTheDocument()
    expect(screen.getByText('Dont have an account?')).toBeInTheDocument()
  })

  it('submit button is disabled when fields are empty', async () => {
    renderWithProviders(<SignInForm />)

    const submitButton = screen.getByTestId('signin-button')
    expect(submitButton).toBeDisabled()
  })

  it('submit button is active when fields are fielled', async () => {
    renderWithProviders(<SignInForm />)

    const loginInput = screen.getByTestId('login-signin')
    const passwordInput = screen.getByTestId('password-signin')
    const submitButton = screen.getByTestId('signin-button')

    await userEvent.type(loginInput, 'user')
    await userEvent.type(passwordInput, 'StrongPass!1234')

    expect(submitButton).not.toBeDisabled()
  })

  it('login and password are empty', async () => {
    renderWithProviders(<SignInForm />)

    const submitButton = screen.getByTestId('signin-button')

    expect(submitButton).toBeDisabled()
    submitButton.removeAttribute('disabled')
    expect(submitButton).not.toBeDisabled()

    await userEvent.click(submitButton)

    expect(
      await screen.findByText('Please enter your email or username')
    ).toBeInTheDocument()
    expect(
      await screen.findByText('Please enter your password')
    ).toBeInTheDocument()
  })

  it('show error when credentals are invalid', async () => {
    ;(signIn as jest.Mock).mockResolvedValueOnce({
      error: 'Credentialssignin',
    })
    renderWithProviders(<SignInForm />)
    const loginInput = screen.getByTestId('login-signin')
    const passwordInput = screen.getByTestId('password-signin')
    const submitButton = screen.getByTestId('signin-button')

    await userEvent.type(loginInput, 'wronguser')
    await userEvent.type(passwordInput, 'WrongPass123!')

    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Credentialssignin/i)).toBeInTheDocument()
    })
  })
})
