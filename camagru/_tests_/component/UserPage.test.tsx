import { render, screen, waitFor } from '@testing-library/react'
import UserProfile from '@/components/UserPage'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  useSession: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}))

describe('user profile component', () => {
  const mockedUseParams = useParams as jest.Mock

  beforeEach(() => {
    mockedUseParams.mockReturnValue({ id: '123' })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders user info when user is authenticated', async () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          id: '123',
          name: 'John Doe',
          username: 'jdoe',
          email: 'john@example.com',
        },
      },
      status: 'authenticated',
    })

    const mockResponse = {
      ok: true,
      json: async () => ({
        id: '123',
        name: 'John Doe',
        username: 'jdoe',
        bio: 'Hello there',
        image: '/avatar.png',
      }),
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
      clone: () => mockResponse,
      redirected: false,
      type: 'basic',
      url: '',
      body: null,
      bodyUsed: false,
      arrayBuffer: async () => new ArrayBuffer(0),
      blob: async () => new Blob(),
      formData: async () => new FormData(),
      text: async () => JSON.stringify({}),
    } as unknown as Response

    global.fetch = jest.fn().mockResolvedValueOnce(mockResponse)

    render(<UserProfile />)

    expect(screen.getByTestId('skeleton')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('jdoe')).toBeInTheDocument()
      expect(screen.getByText('Hello there')).toBeInTheDocument()
    })
  })
})
