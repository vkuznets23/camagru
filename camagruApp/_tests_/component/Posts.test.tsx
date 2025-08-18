import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import UserPosts from '@/components/posts/Posts'
import { useSession } from 'next-auth/react'
import { useUser } from '@/context/userContext'
import '@testing-library/jest-dom'
import { User } from '@/types/user'

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}))

jest.mock('@/context/userContext', () => ({
  useUser: jest.fn(),
}))

describe('UserPosts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    window.scrollTo = jest.fn()
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
        savedByCurrentUser: false,
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
        savedByCurrentUser: false,
      },
    ],
  }

  it('renders post cards for each post', async () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: { user: { id: 'user-1', name: 'Test User' } },
      status: 'authenticated',
    })
    ;(useUser as jest.Mock).mockReturnValue({
      user: mockUser,
      handleCommentAdded: jest.fn(),
    })

    render(<UserPosts />)

    await waitFor(() => {
      expect(screen.getAllByAltText(/Post image/i)).toHaveLength(2)
    })
  })

  it('shows NoPosts if no posts are passed', async () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: { user: { id: 'user-1', name: 'Test User' } },
      status: 'authenticated',
    })
    ;(useUser as jest.Mock).mockReturnValue({
      user: { ...mockUser, posts: [] },
      handleCommentAdded: jest.fn(),
    })

    render(<UserPosts />)

    await waitFor(() => {
      expect(screen.getByText(/No posts yet/i)).toBeInTheDocument()
    })
  })

  it('opens PostModal with correct content on post click', async () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: { user: { id: 'user-1', name: 'Test User' } },
      status: 'authenticated',
    })
    ;(useUser as jest.Mock).mockReturnValue({
      user: mockUser,
      handleCommentAdded: jest.fn(),
    })

    render(<UserPosts />)

    await waitFor(() => {
      expect(screen.getAllByAltText('Post image').length).toBeGreaterThan(0)
    })

    const images = screen.getAllByAltText('Post image')
    fireEvent.click(images[0])

    await waitFor(() => {
      expect(
        screen.getByText(mockUser.posts[0].user.username)
      ).toBeInTheDocument()
    })

    expect(screen.getByText(/2024/)).toBeInTheDocument()
    expect(screen.getByText(mockUser.posts[0].content)).toBeInTheDocument()

    if (mockUser.posts[0].comments.length === 0) {
      expect(screen.getByText(/no comments/i)).toBeInTheDocument()
    }

    expect(
      screen.getByText(mockUser.posts[0].likesCount.toString())
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '×' })).toBeInTheDocument()
  })
})
