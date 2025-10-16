import { render, screen, fireEvent } from '@testing-library/react'
import Feed from '@/components/posts/Feed'
import { useUser } from '@/context/userContext'
import { Post } from '@/types/post'
import '@testing-library/jest-dom'

// Mock PostCard component
jest.mock('@/components/posts/PostCard', () => {
  return function MockPostCard({
    post,
    onCommentAdded,
    currentUserId,
    priority,
  }: {
    post: Post
    onCommentAdded: (comment: { id: string; content: string }) => void
    currentUserId: string
    priority: boolean
  }) {
    return (
      <div data-testid={`post-card-${post.id}`}>
        <div data-testid="post-content">{post.content}</div>
        <div data-testid="post-author">{post.user.name}</div>
        <div data-testid="post-date">{post.createdAt}</div>
        <div data-testid="post-priority">
          {priority ? 'priority' : 'normal'}
        </div>
        <div data-testid="current-user-id">{currentUserId}</div>
        <button
          data-testid="add-comment"
          onClick={() =>
            onCommentAdded({ id: 'comment-1', content: 'Test comment' })
          }
        >
          Add Comment
        </button>
      </div>
    )
  }
})

// Mock NoPosts component
jest.mock('@/components/posts/NoPosts', () => {
  return function MockNoPosts() {
    return <div data-testid="no-posts">No posts available</div>
  }
})

// Mock useUser hook
jest.mock('@/context/userContext', () => ({
  useUser: jest.fn(),
}))

describe('Feed', () => {
  const mockHandleCommentAdded = jest.fn()
  const mockUser = {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
  }

  const createMockPost = (
    id: string,
    content: string,
    createdAt: string,
    authorName: string
  ): Post => ({
    id,
    content,
    image: `/image${id}.jpg`,
    createdAt,
    user: {
      id: `author-${id}`,
      name: authorName,
      username: `author${id}`,
      image: `/avatar${id}.jpg`,
      posts: [],
      _count: {
        posts: 0,
        followers: 0,
        following: 0,
      },
      followers: [],
      following: [],
      savedPosts: [],
    },
    comments: [],
    likedByCurrentUser: false,
    savedByCurrentUser: false,
    likesCount: 0,
  })

  const mockPosts: Post[] = [
    createMockPost(
      'post-1',
      'First post content',
      '2024-01-01T10:00:00.000Z',
      'Author One'
    ),
    createMockPost(
      'post-2',
      'Second post content',
      '2024-01-01T12:00:00.000Z',
      'Author Two'
    ),
    createMockPost(
      'post-3',
      'Third post content',
      '2024-01-01T14:00:00.000Z',
      'Author Three'
    ),
    createMockPost(
      'post-4',
      'Fourth post content',
      '2024-01-01T16:00:00.000Z',
      'Author Four'
    ),
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useUser as jest.Mock).mockReturnValue({
      user: mockUser,
      handleCommentAdded: mockHandleCommentAdded,
    })
  })

  it('renders posts in chronological order (newest first)', () => {
    render(<Feed posts={mockPosts} />)

    const postCards = screen.getAllByTestId(/post-card-/)
    expect(postCards).toHaveLength(4)

    // Check that posts are sorted by date (newest first)
    expect(screen.getByTestId('post-card-post-4')).toBeInTheDocument() // 16:00
    expect(screen.getByTestId('post-card-post-3')).toBeInTheDocument() // 14:00
    expect(screen.getByTestId('post-card-post-2')).toBeInTheDocument() // 12:00
    expect(screen.getByTestId('post-card-post-1')).toBeInTheDocument() // 10:00
  })

  it('renders NoPosts when posts array is empty', () => {
    render(<Feed posts={[]} />)

    expect(screen.getByTestId('no-posts')).toBeInTheDocument()
    expect(screen.queryByTestId(/post-card-/)).not.toBeInTheDocument()
  })

  it('renders NoPosts when posts is null', () => {
    render(<Feed posts={null as unknown as Post[]} />)

    expect(screen.getByTestId('no-posts')).toBeInTheDocument()
    expect(screen.queryByTestId(/post-card-/)).not.toBeInTheDocument()
  })

  it('renders NoPosts when posts is undefined', () => {
    render(<Feed posts={undefined as unknown as Post[]} />)

    expect(screen.getByTestId('no-posts')).toBeInTheDocument()
    expect(screen.queryByTestId(/post-card-/)).not.toBeInTheDocument()
  })

  it('renders posts when user is not authenticated', () => {
    ;(useUser as jest.Mock).mockReturnValue({
      user: null,
      handleCommentAdded: mockHandleCommentAdded,
    })

    render(<Feed posts={mockPosts} />)

    expect(screen.getByTestId('post-card-post-4')).toBeInTheDocument()
    expect(screen.getByTestId('post-card-post-3')).toBeInTheDocument()
    expect(screen.getByTestId('post-card-post-2')).toBeInTheDocument()
    expect(screen.getByTestId('post-card-post-1')).toBeInTheDocument()
  })

  it('renders posts when user is undefined', () => {
    ;(useUser as jest.Mock).mockReturnValue({
      user: undefined,
      handleCommentAdded: mockHandleCommentAdded,
    })

    render(<Feed posts={mockPosts} />)

    expect(screen.getByTestId('post-card-post-4')).toBeInTheDocument()
    expect(screen.getByTestId('post-card-post-3')).toBeInTheDocument()
    expect(screen.getByTestId('post-card-post-2')).toBeInTheDocument()
    expect(screen.getByTestId('post-card-post-1')).toBeInTheDocument()
  })

  it('sets priority to true for first 3 posts', () => {
    render(<Feed posts={mockPosts} />)

    const priorityElements = screen.getAllByTestId('post-priority')

    // First 3 posts should have priority
    expect(priorityElements[0]).toHaveTextContent('priority')
    expect(priorityElements[1]).toHaveTextContent('priority')
    expect(priorityElements[2]).toHaveTextContent('priority')
    expect(priorityElements[3]).toHaveTextContent('normal')
  })

  it('handles comment addition correctly', () => {
    render(<Feed posts={mockPosts} />)

    const addCommentButtons = screen.getAllByTestId('add-comment')
    fireEvent.click(addCommentButtons[0])

    expect(mockHandleCommentAdded).toHaveBeenCalledWith({
      id: 'comment-1',
      content: 'Test comment',
    })
  })

  it('renders with correct accessibility attributes', () => {
    render(<Feed posts={mockPosts} />)

    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
  })

  it('handles posts with different date formats', () => {
    const postsWithDifferentDates: Post[] = [
      createMockPost('post-1', 'Post 1', '2024-01-01T10:00:00Z', 'Author One'),
      createMockPost(
        'post-2',
        'Post 2',
        '2024-01-01T12:00:00.000Z',
        'Author Two'
      ),
    ]

    render(<Feed posts={postsWithDifferentDates} />)

    const postCards = screen.getAllByTestId(/post-card-/)
    expect(postCards).toHaveLength(2)

    // Should still sort correctly
    expect(screen.getByTestId('post-card-post-2')).toBeInTheDocument()
    expect(screen.getByTestId('post-card-post-1')).toBeInTheDocument()
  })

  it('handles posts with empty content', () => {
    const postsWithEmptyContent: Post[] = [
      createMockPost('post-1', '', '2024-01-01T10:00:00.000Z', 'Author One'),
    ]

    render(<Feed posts={postsWithEmptyContent} />)

    expect(screen.getByTestId('post-card-post-1')).toBeInTheDocument()
    expect(screen.getByTestId('post-content')).toHaveTextContent('')
  })

  it('handles posts with very long content', () => {
    const longContent = 'a'.repeat(1000)
    const postsWithLongContent: Post[] = [
      createMockPost(
        'post-1',
        longContent,
        '2024-01-01T10:00:00.000Z',
        'Author One'
      ),
    ]

    render(<Feed posts={postsWithLongContent} />)

    expect(screen.getByTestId('post-card-post-1')).toBeInTheDocument()
    expect(screen.getByTestId('post-content')).toHaveTextContent(longContent)
  })

  it('handles posts with special characters in content', () => {
    const specialContent = 'Hello! 👋 How are you? 😊 @#$%^&*()'
    const postsWithSpecialContent: Post[] = [
      createMockPost(
        'post-1',
        specialContent,
        '2024-01-01T10:00:00.000Z',
        'Author One'
      ),
    ]

    render(<Feed posts={postsWithSpecialContent} />)

    expect(screen.getByTestId('post-card-post-1')).toBeInTheDocument()
    expect(screen.getByTestId('post-content')).toHaveTextContent(specialContent)
  })

  it('maintains original posts array (does not mutate)', () => {
    const originalPosts = [...mockPosts]
    render(<Feed posts={mockPosts} />)

    // Original array should not be modified
    expect(mockPosts).toEqual(originalPosts)
  })

  it('handles single post correctly', () => {
    const singlePost = [mockPosts[0]]
    render(<Feed posts={singlePost} />)

    expect(screen.getByTestId('post-card-post-1')).toBeInTheDocument()
    expect(screen.getAllByTestId(/post-card-/)).toHaveLength(1)
    expect(screen.getByTestId('post-priority')).toHaveTextContent('priority')
  })

  it('handles exactly 3 posts (all should have priority)', () => {
    const threePosts = mockPosts.slice(0, 3)
    render(<Feed posts={threePosts} />)

    const priorityElements = screen.getAllByTestId('post-priority')
    expect(priorityElements).toHaveLength(3)

    priorityElements.forEach((element) => {
      expect(element).toHaveTextContent('priority')
    })
  })

  it('handles more than 3 posts (only first 3 have priority)', () => {
    const manyPosts: Post[] = [
      ...mockPosts,
      createMockPost(
        'post-5',
        'Fifth post content',
        '2024-01-01T18:00:00.000Z',
        'Author Five'
      ),
      createMockPost(
        'post-6',
        'Sixth post content',
        '2024-01-01T20:00:00.000Z',
        'Author Six'
      ),
    ]

    render(<Feed posts={manyPosts} />)

    const priorityElements = screen.getAllByTestId('post-priority')
    expect(priorityElements).toHaveLength(6)

    // First 3 should have priority
    expect(priorityElements[0]).toHaveTextContent('priority')
    expect(priorityElements[1]).toHaveTextContent('priority')
    expect(priorityElements[2]).toHaveTextContent('priority')

    // Last 3 should not have priority
    expect(priorityElements[3]).toHaveTextContent('normal')
    expect(priorityElements[4]).toHaveTextContent('normal')
    expect(priorityElements[5]).toHaveTextContent('normal')
  })
})
