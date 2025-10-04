import { render, screen, waitFor } from '@testing-library/react'
import SavedPosts from '@/components/posts/SavedPosts'
import { useSession } from 'next-auth/react'
import { useUser } from '@/context/userContext'
import '@testing-library/jest-dom'
import { User } from '@/types/user'
import { Post } from '@/types/post'

// Mock dependencies
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}))

jest.mock('@/context/userContext', () => ({
  useUser: jest.fn(),
}))

jest.mock('@/components/posts/PostCard', () => {
  return function MockPostCard({
    post,
    priority,
  }: {
    post: Post
    priority: boolean
  }) {
    return (
      <div data-testid={`post-card-${post.id}`} data-priority={priority}>
        <img src={post.image} alt="Post image" />
        <p>{post.content}</p>
        <span>Likes: {post.likesCount}</span>
      </div>
    )
  }
})

jest.mock('@/components/posts/NoPosts', () => {
  return function MockNoPosts() {
    return <div data-testid="no-posts">No saved posts yet</div>
  }
})

describe('SavedPosts', () => {
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
    savedPosts: [
      {
        id: 'saved-post-1',
        image: '/saved-post1.jpg',
        content: 'This is a saved post!',
        createdAt: '2024-01-01T12:00:00.000Z',
        user: {
          id: 'user-2',
          name: 'Jane Smith',
          username: 'jsmith',
          image: '/avatar2.jpg',
          posts: [],
          _count: { posts: 1, followers: 5, following: 2 },
          followers: [],
          following: [],
          savedPosts: [],
        },
        comments: [],
        likedByCurrentUser: true,
        likesCount: 15,
        savedByCurrentUser: true,
        blurDataURL: 'data:image/jpeg;base64,test',
      },
      {
        id: 'saved-post-2',
        image: '/saved-post2.jpg',
        content: 'Another saved post!',
        createdAt: '2024-01-02T12:00:00.000Z',
        user: {
          id: 'user-3',
          name: 'Bob Wilson',
          username: 'bwilson',
          image: '/avatar3.jpg',
          posts: [],
          _count: { posts: 3, followers: 8, following: 1 },
          followers: [],
          following: [],
          savedPosts: [],
        },
        comments: [],
        likedByCurrentUser: false,
        likesCount: 7,
        savedByCurrentUser: true,
      },
    ],
    posts: [],
  }

  const mockHandleCommentAdded = jest.fn()

  it('renders saved posts when user has saved posts', async () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: { user: { id: 'user-1' } },
      status: 'authenticated',
    })
    ;(useUser as jest.Mock).mockReturnValue({
      user: mockUser,
      handleCommentAdded: mockHandleCommentAdded,
    })

    render(<SavedPosts />)

    await waitFor(() => {
      expect(screen.getByTestId('post-card-saved-post-1')).toBeInTheDocument()
      expect(screen.getByTestId('post-card-saved-post-2')).toBeInTheDocument()
    })

    // Check that posts are rendered with correct content
    expect(screen.getByText('This is a saved post!')).toBeInTheDocument()
    expect(screen.getByText('Another saved post!')).toBeInTheDocument()
    expect(screen.getByText('Likes: 15')).toBeInTheDocument()
    expect(screen.getByText('Likes: 7')).toBeInTheDocument()
  })

  it('shows NoPosts component when user has no saved posts', async () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: { user: { id: 'user-1' } },
      status: 'authenticated',
    })
    ;(useUser as jest.Mock).mockReturnValue({
      user: { ...mockUser, savedPosts: [] },
      handleCommentAdded: mockHandleCommentAdded,
    })

    render(<SavedPosts />)

    await waitFor(() => {
      expect(screen.getByTestId('no-posts')).toBeInTheDocument()
      expect(screen.getByText('No saved posts yet')).toBeInTheDocument()
    })

    // Ensure no post cards are rendered
    expect(
      screen.queryByTestId('post-card-saved-post-1')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('post-card-saved-post-2')
    ).not.toBeInTheDocument()
  })

  it('shows NoPosts component when savedPosts is null', async () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: { user: { id: 'user-1' } },
      status: 'authenticated',
    })
    ;(useUser as jest.Mock).mockReturnValue({
      user: { ...mockUser, savedPosts: null },
      handleCommentAdded: mockHandleCommentAdded,
    })

    render(<SavedPosts />)

    await waitFor(() => {
      expect(screen.getByTestId('no-posts')).toBeInTheDocument()
    })
  })

  it('returns null when session is loading', () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'loading',
    })
    ;(useUser as jest.Mock).mockReturnValue({
      user: mockUser,
      handleCommentAdded: mockHandleCommentAdded,
    })

    const { container } = render(<SavedPosts />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when user is not authenticated', () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    })
    ;(useUser as jest.Mock).mockReturnValue({
      user: mockUser,
      handleCommentAdded: mockHandleCommentAdded,
    })

    const { container } = render(<SavedPosts />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when userID is not available', () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: { user: null },
      status: 'authenticated',
    })
    ;(useUser as jest.Mock).mockReturnValue({
      user: mockUser,
      handleCommentAdded: mockHandleCommentAdded,
    })

    const { container } = render(<SavedPosts />)
    expect(container.firstChild).toBeNull()
  })

  it('sets priority correctly for first 3 posts', async () => {
    const userWithManySavedPosts = {
      ...mockUser,
      savedPosts: [
        ...mockUser.savedPosts,
        {
          id: 'saved-post-3',
          image: '/saved-post3.jpg',
          content: 'Third saved post!',
          createdAt: '2024-01-03T12:00:00.000Z',
          user: {
            id: 'user-4',
            name: 'Alice Brown',
            username: 'abrown',
            image: '/avatar4.jpg',
            posts: [],
            _count: { posts: 2, followers: 3, following: 4 },
            followers: [],
            following: [],
            savedPosts: [],
          },
          comments: [],
          likedByCurrentUser: false,
          likesCount: 12,
          savedByCurrentUser: true,
        },
        {
          id: 'saved-post-4',
          image: '/saved-post4.jpg',
          content: 'Fourth saved post!',
          createdAt: '2024-01-04T12:00:00.000Z',
          user: {
            id: 'user-5',
            name: 'Charlie Davis',
            username: 'cdavis',
            image: '/avatar5.jpg',
            posts: [],
            _count: { posts: 1, followers: 2, following: 1 },
            followers: [],
            following: [],
            savedPosts: [],
          },
          comments: [],
          likedByCurrentUser: true,
          likesCount: 9,
          savedByCurrentUser: true,
        },
      ],
    }

    ;(useSession as jest.Mock).mockReturnValue({
      data: { user: { id: 'user-1' } },
      status: 'authenticated',
    })
    ;(useUser as jest.Mock).mockReturnValue({
      user: userWithManySavedPosts,
      handleCommentAdded: mockHandleCommentAdded,
    })

    render(<SavedPosts />)

    await waitFor(() => {
      // First 3 posts should have priority=true
      expect(screen.getByTestId('post-card-saved-post-1')).toHaveAttribute(
        'data-priority',
        'true'
      )
      expect(screen.getByTestId('post-card-saved-post-2')).toHaveAttribute(
        'data-priority',
        'true'
      )
      expect(screen.getByTestId('post-card-saved-post-3')).toHaveAttribute(
        'data-priority',
        'true'
      )

      // 4th post should have priority=false
      expect(screen.getByTestId('post-card-saved-post-4')).toHaveAttribute(
        'data-priority',
        'false'
      )
    })
  })

  it('passes correct props to PostCard components', async () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: { user: { id: 'user-1' } },
      status: 'authenticated',
    })
    ;(useUser as jest.Mock).mockReturnValue({
      user: mockUser,
      handleCommentAdded: mockHandleCommentAdded,
    })

    render(<SavedPosts />)

    await waitFor(() => {
      const postCard = screen.getByTestId('post-card-saved-post-1')
      expect(postCard).toBeInTheDocument()

      // Check that the post content is displayed
      expect(screen.getByText('This is a saved post!')).toBeInTheDocument()
      expect(screen.getByText('Likes: 15')).toBeInTheDocument()
    })
  })

  it('renders posts in correct order (using slice())', async () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: { user: { id: 'user-1' } },
      status: 'authenticated',
    })
    ;(useUser as jest.Mock).mockReturnValue({
      user: mockUser,
      handleCommentAdded: mockHandleCommentAdded,
    })

    render(<SavedPosts />)

    await waitFor(() => {
      const postCards = screen.getAllByTestId(/post-card-/)
      expect(postCards).toHaveLength(2)

      // Check that posts are rendered in the same order as in the array
      expect(postCards[0]).toHaveAttribute(
        'data-testid',
        'post-card-saved-post-1'
      )
      expect(postCards[1]).toHaveAttribute(
        'data-testid',
        'post-card-saved-post-2'
      )
    })
  })

  it('has correct accessibility attributes', async () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: { user: { id: 'user-1' } },
      status: 'authenticated',
    })
    ;(useUser as jest.Mock).mockReturnValue({
      user: mockUser,
      handleCommentAdded: mockHandleCommentAdded,
    })

    render(<SavedPosts />)

    await waitFor(() => {
      // Check for role="list" on the container
      const listContainer = screen.getByRole('list')
      expect(listContainer).toBeInTheDocument()

      // Check for role="listitem" on each post
      const listItems = screen.getAllByRole('listitem')
      expect(listItems).toHaveLength(2)
    })
  })
})
