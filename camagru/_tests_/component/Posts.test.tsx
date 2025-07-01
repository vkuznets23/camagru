import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import UserPosts from '@/components/posts/Posts'
import { useSession } from 'next-auth/react'
import '@testing-library/jest-dom'
import { User } from '@/types/user'

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}))

describe('UserPosts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockUser: User = {
    id: 'user-1',
    name: 'John Doe',
    username: 'jdoe',
    bio: 'Hello world!',
    image: '/avatar.jpg',
    _count: {
      posts: 2,
      followers: 10,
      following: 3,
    },
    followers: [],
    following: [],
    savedPosts: [],
    posts: [
      {
        id: 'post-1',
        image: '/post1.jpg',
        content: 'Hello World!',
        createdAt: '2024-01-01T12:00:00.000Z',
        user: {
          id: 'user-1',
          name: 'John Doe',
          username: 'jdoe',
          image: '/avatar.jpg',
          posts: [],
          _count: { posts: 2, followers: 0, following: 0 },
          followers: [],
          following: [],
          savedPosts: [],
        },
        comments: [],
        likedByCurrentUser: false,
        likesCount: 3,
      },
      {
        id: 'post-2',
        image: '/post2.jpg',
        content: 'Second post!',
        createdAt: '2024-01-01T12:00:00.000Z',
        user: {
          id: 'user-1',
          name: 'John Doe',
          username: 'jdoe',
          image: '/avatar.jpg',
          posts: [],
          _count: { posts: 2, followers: 0, following: 0 },
          followers: [],
          following: [],
          savedPosts: [],
        },
        comments: [],
        likedByCurrentUser: false,
        likesCount: 3,
      },
    ],
  }

  it('renders post cards for each post', async () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          id: 'user-1',
          name: 'Test User',
        },
      },
      status: 'authenticated',
    })

    render(<UserPosts posts={mockUser.posts} />)

    await waitFor(() => {
      expect(screen.getAllByAltText(/Post image/i)).toHaveLength(2)
    })
  })

  it('shows NoPosts if no posts are passed', async () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          id: 'user-1',
          name: 'Test User',
        },
      },
      status: 'authenticated',
    })

    render(<UserPosts posts={[]} />)

    await waitFor(() => {
      expect(screen.getByText(/No posts yet/i)).toBeInTheDocument()
    })
  })

  it('shows loading if session is not ready', async () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'loading',
    })

    render(<UserPosts posts={mockUser.posts} />)

    expect(screen.getByText(/Loading user/i)).toBeInTheDocument()
  })

  it('opens PostModal with correct content on post click', async () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          id: 'user-1',
          name: 'Test User',
        },
      },
      status: 'authenticated',
    })

    render(<UserPosts posts={mockUser.posts} />)

    await waitFor(() => {
      expect(screen.getAllByAltText('Post image').length).toBeGreaterThan(0)
    })

    const images = screen.getAllByAltText('Post image')
    fireEvent.click(images[0])

    await waitFor(() => {
      expect(screen.getByText('Hello World!')).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: '×' })).toBeInTheDocument()
  })
})
