import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CommentForm from '@/components/posts/AddCommentForm'
import '@testing-library/jest-dom'
import { Comment } from '@/types/comment'

// Mock fetch globally
global.fetch = jest.fn()

// Mock getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    lineHeight: '20px',
    getPropertyValue: jest.fn().mockReturnValue('20px'),
  }),
})

const mockComment: Comment = {
  id: 'comment-1',
  content: 'Test comment',
  createdAt: new Date().toISOString(),
  postId: 'post-1',
  user: {
    id: 'user-1',
    name: 'John Doe',
    username: 'jdoe',
    image: '/avatar.jpg',
    posts: [],
    _count: { posts: 0, followers: 0, following: 0 },
    followers: [],
    following: [],
    savedPosts: [],
  },
}

describe('CommentForm', () => {
  const mockOnCommentAdded = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockClear()
    // Mock console.error to avoid noise in test output
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders textarea and submit button initially', () => {
    render(<CommentForm postId="post-1" onCommentAdded={mockOnCommentAdded} />)

    expect(screen.getByPlaceholderText(/write a comment/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /post comment/i })
    ).toBeInTheDocument()
    expect(screen.queryByText(/comment is too long/i)).not.toBeInTheDocument()
  })

  it('disables submit button when textarea is empty', () => {
    render(<CommentForm postId="post-1" onCommentAdded={mockOnCommentAdded} />)

    const submitButton = screen.getByRole('button', { name: /post comment/i })
    expect(submitButton).toBeDisabled()
  })

  it('enables submit button when textarea has content', () => {
    render(<CommentForm postId="post-1" onCommentAdded={mockOnCommentAdded} />)

    const textarea = screen.getByPlaceholderText(/write a comment/i)
    const submitButton = screen.getByRole('button', { name: /post comment/i })

    fireEvent.input(textarea, { target: { value: 'Test comment' } })

    expect(submitButton).not.toBeDisabled()
  })

  it('shows error if comment exceeds max length', () => {
    render(<CommentForm postId="post-1" onCommentAdded={mockOnCommentAdded} />)

    const longText = 'a'.repeat(2201)
    const textarea = screen.getByPlaceholderText(/write a comment/i)

    fireEvent.input(textarea, { target: { value: longText } })
    fireEvent.submit(screen.getByTestId('comment-form'))

    expect(screen.getByText(/comment is too long/i)).toBeInTheDocument()
  })

  it('clears error when user starts typing again', () => {
    render(<CommentForm postId="post-1" onCommentAdded={mockOnCommentAdded} />)

    const textarea = screen.getByPlaceholderText(/write a comment/i)

    // First, create an error
    const longText = 'a'.repeat(2201)
    fireEvent.input(textarea, { target: { value: longText } })
    fireEvent.submit(screen.getByTestId('comment-form'))

    expect(screen.getByText(/comment is too long/i)).toBeInTheDocument()

    // Then clear it by typing again
    fireEvent.input(textarea, { target: { value: 'Valid comment' } })

    expect(screen.queryByText(/comment is too long/i)).not.toBeInTheDocument()
  })

  it('submits comment successfully', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockComment,
    })

    render(<CommentForm postId="post-1" onCommentAdded={mockOnCommentAdded} />)

    const textarea = screen.getByPlaceholderText(/write a comment/i)
    const form = screen.getByTestId('comment-form')

    fireEvent.input(textarea, { target: { value: 'Test comment' } })
    fireEvent.submit(form)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: 'Test comment', postId: 'post-1' }),
      })
    })

    await waitFor(() => {
      expect(mockOnCommentAdded).toHaveBeenCalledWith(mockComment)
    })

    // Check that textarea is cleared after successful submission
    expect((textarea as HTMLTextAreaElement).value).toBe('')
  })

  it('shows error message when API call fails', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    })

    render(<CommentForm postId="post-1" onCommentAdded={mockOnCommentAdded} />)

    const textarea = screen.getByPlaceholderText(/write a comment/i)
    const form = screen.getByTestId('comment-form')

    fireEvent.input(textarea, { target: { value: 'Test comment' } })
    fireEvent.submit(form)

    await waitFor(() => {
      expect(screen.getByText(/failed to send comment/i)).toBeInTheDocument()
    })

    expect(mockOnCommentAdded).not.toHaveBeenCalled()
  })

  it('handles network error gracefully', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    )

    render(<CommentForm postId="post-1" onCommentAdded={mockOnCommentAdded} />)

    const textarea = screen.getByPlaceholderText(/write a comment/i)
    const form = screen.getByTestId('comment-form')

    fireEvent.input(textarea, { target: { value: 'Test comment' } })
    fireEvent.submit(form)

    await waitFor(() => {
      expect(screen.getByText(/failed to send comment/i)).toBeInTheDocument()
    })

    expect(mockOnCommentAdded).not.toHaveBeenCalled()
  })

  it('prevents submission when textarea is empty', () => {
    render(<CommentForm postId="post-1" onCommentAdded={mockOnCommentAdded} />)

    const form = screen.getByTestId('comment-form')
    fireEvent.submit(form)

    expect(global.fetch).not.toHaveBeenCalled()
    expect(mockOnCommentAdded).not.toHaveBeenCalled()
  })

  it('prevents submission when textarea has only whitespace', () => {
    render(<CommentForm postId="post-1" onCommentAdded={mockOnCommentAdded} />)

    const textarea = screen.getByPlaceholderText(/write a comment/i)
    const form = screen.getByTestId('comment-form')

    fireEvent.input(textarea, { target: { value: '   ' } })
    fireEvent.submit(form)

    expect(global.fetch).not.toHaveBeenCalled()
    expect(mockOnCommentAdded).not.toHaveBeenCalled()
  })

  it('submits comment on Enter key press', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockComment,
    })

    render(<CommentForm postId="post-1" onCommentAdded={mockOnCommentAdded} />)

    const textarea = screen.getByPlaceholderText(/write a comment/i)

    fireEvent.input(textarea, { target: { value: 'Test comment' } })
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false })

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: 'Test comment', postId: 'post-1' }),
      })
    })
  })

  it('does not submit on Shift+Enter', () => {
    render(<CommentForm postId="post-1" onCommentAdded={mockOnCommentAdded} />)

    const textarea = screen.getByPlaceholderText(/write a comment/i)

    fireEvent.input(textarea, { target: { value: 'Test comment' } })
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true })

    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('has correct accessibility attributes', () => {
    render(<CommentForm postId="post-1" onCommentAdded={mockOnCommentAdded} />)

    const textarea = screen.getByLabelText(/write a comment/i)
    const submitButton = screen.getByRole('button', { name: /post comment/i })

    expect(textarea).toHaveAttribute('aria-label', 'Write a comment')
    expect(textarea).toHaveAttribute('maxLength', '2300') // MAX_COMMENT_LENGTH + 100
    expect(textarea).toHaveAttribute('required')
    expect(submitButton).toHaveAttribute('aria-label', 'Post comment')
  })

  it('updates aria-label when submitting', async () => {
    ;(global.fetch as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => mockComment,
              }),
            100
          )
        )
    )

    render(<CommentForm postId="post-1" onCommentAdded={mockOnCommentAdded} />)

    const textarea = screen.getByPlaceholderText(/write a comment/i)
    const form = screen.getByTestId('comment-form')

    fireEvent.input(textarea, { target: { value: 'Test comment' } })
    fireEvent.submit(form)

    // Check that aria-label changes during submission
    expect(
      screen.getByRole('button', { name: /posting comment/i })
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /post comment/i })
      ).toBeInTheDocument()
    })
  })

  it('handles auto-resize functionality', () => {
    render(<CommentForm postId="post-1" onCommentAdded={mockOnCommentAdded} />)

    const textarea = screen.getByPlaceholderText(/write a comment/i)

    // Mock scrollHeight to be less than max height (3 rows * 20px = 60px)
    Object.defineProperty(textarea, 'scrollHeight', {
      writable: true,
      value: 40,
    })

    fireEvent.input(textarea, {
      target: { value: 'Test comment\nwith multiple lines' },
    })

    // The autoResize function should be called and set height to scrollHeight
    expect(textarea.style.height).toBe('40px')
  })

  it('limits textarea height to max rows', () => {
    render(<CommentForm postId="post-1" onCommentAdded={mockOnCommentAdded} />)

    const textarea = screen.getByPlaceholderText(/write a comment/i)

    // Mock scrollHeight to exceed max height (3 rows * 20px = 60px)
    Object.defineProperty(textarea, 'scrollHeight', {
      writable: true,
      value: 100,
    })

    fireEvent.input(textarea, {
      target: {
        value: 'Very long comment with many lines\nline 2\nline 3\nline 4',
      },
    })

    // Should be limited to max height
    expect(textarea.style.height).toBe('60px')
    expect(textarea.style.overflowY).toBe('auto')
  })
})
