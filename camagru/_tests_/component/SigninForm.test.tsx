import { render, screen, waitFor } from '@testing-library/react'
import SignInForm from '@/components/SigninForm'
import userEvent from '@testing-library/user-event'
import { signIn } from 'next-auth/react'

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}))

// fail login
// check that nav bar is not on the screen

describe('SigninForm', () => {
  it('render inputs and buttons', () => {
    render(<SignInForm />)

    expect(screen.queryByTestId('navbar')).not.toBeInTheDocument()

    expect(screen.getByTestId('password-signin')).toBeInTheDocument()
    expect(screen.getByTestId('login-signin')).toBeInTheDocument()
    expect(screen.getByTestId('toggle-btn')).toBeInTheDocument()
    expect(screen.getByTestId('signin-button')).toBeInTheDocument()
    expect(screen.getByText('Forgotten your password?')).toBeInTheDocument()
    expect(screen.getByText('Dont have an account?')).toBeInTheDocument()
  })

  it('submit button is disabled when fields are empty', async () => {
    render(<SignInForm />)

    const submitButton = screen.getByTestId('signin-button')
    expect(submitButton).toBeDisabled()
  })

  it('submit button is active when fields are fielled', async () => {
    render(<SignInForm />)

    const loginInput = screen.getByTestId('login-signin')
    const passwordInput = screen.getByTestId('password-signin')
    const submitButton = screen.getByTestId('signin-button')

    await userEvent.type(loginInput, 'user')
    await userEvent.type(passwordInput, 'StrongPass!1234')

    expect(submitButton).not.toBeDisabled()
  })

  it('login and password are empty', async () => {
    render(<SignInForm />)

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
    render(<SignInForm />)
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
