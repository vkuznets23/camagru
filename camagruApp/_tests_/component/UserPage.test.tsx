import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import UserProfile from '@/components/userpage/UserPage'
import { UserProvider } from '@/context/userContext'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import '@testing-library/jest-dom'
import { Post } from '@/types/post'
import { User } from '@/types/user'

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}))

describe('UserProfile with real UserProvider', () => {
  const mockPush = jest.fn()

  const mockUser: User = {
    id: 'u2',
    name: 'John Doe',
    username: 'johndoe',
    bio: 'Hello world!',
    image: '/avatar.jpg',
    _count: {
      posts: 0,
      followers: 5,
      following: 0,
    },
    followers: [],
    following: [],
    savedPosts: [],
    posts: [],
  }

  const mockPosts: Post[] = []

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    ;(useParams as jest.Mock).mockReturnValue({ id: 'u2' })
    ;(useSession as jest.Mock).mockReturnValue({
      data: { user: { id: 'u1' } },
      status: 'authenticated',
    })

    global.fetch = jest.fn((url: string) => {
      if (url.startsWith('/api/user/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockUser),
        })
      }
      if (url.includes('/is-following')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ following: false }),
        })
      }
      if (url === '/api/follow') {
        return Promise.resolve({ ok: true })
      }
      return Promise.resolve({ ok: true })
    }) as jest.Mock
  })

  it('renders fetched user inside UserProvider', async () => {
    render(
      <UserProvider initialUser={null} initialPosts={[]}>
        <UserProfile />
      </UserProvider>
    )

    expect(screen.getByTestId('skeleton')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByLabelText(/John Doe's profile/i)).toBeInTheDocument()
    })
  })

  it('calls follow API and updates followers count', async () => {
    render(
      <UserProvider initialUser={mockUser} initialPosts={mockPosts}>
        <UserProfile />
      </UserProvider>
    )

    await waitFor(() => {
      expect(screen.getByLabelText(/John Doe's profile/i)).toBeInTheDocument()
    })

    const followButton = await screen.findByTestId('follow-user-desktop')
    fireEvent.click(followButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/(follow|unfollow)/),
        expect.objectContaining({ method: 'POST' })
      )
    })
  })
})
