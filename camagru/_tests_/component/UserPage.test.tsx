import { render, screen, waitFor } from '@testing-library/react'
import UserProfile from '@/components/userpage/UserPage'
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
        posts: [],
        _count: {
          posts: 0,
          followers: 10,
          following: 5,
        },
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

    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(mockResponse)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ following: true }),
      } as Response)

    render(<UserProfile />)

    expect(screen.getByTestId('skeleton')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('jdoe')).toBeInTheDocument()
      expect(screen.getByText('Hello there')).toBeInTheDocument()
      expect(
        screen.getByText((content) => content.includes('No posts yet'))
      ).toBeInTheDocument()
      const counts = screen.getAllByRole('strong')
      expect(counts[0]).toHaveTextContent('0')
      expect(counts[0].parentElement).toHaveTextContent('posts')

      expect(counts[1]).toHaveTextContent('10')
      expect(counts[1].parentElement).toHaveTextContent('followers')

      expect(counts[2]).toHaveTextContent('5')
      expect(counts[2].parentElement).toHaveTextContent('following')
    })
  })
})
