import { render, screen, fireEvent } from '@testing-library/react'
import CommentForm from '@/components/posts/AddCommentForm'
import '@testing-library/jest-dom'

// const mockComment = {
//   id: 'comment-1',
//   content: 'Test comment',
//   createdAt: new Date().toISOString(),
//   postId: 'post-1',
//   user: {
//     id: 'user-1',
//     name: 'John Doe',
//     username: 'jdoe',
//     image: '/avatar.jpg',
//     posts: [],
//     _count: { posts: 0, followers: 0, following: 0 },
//     followers: [],
//     following: [],
//     savedPosts: [],
//   },
// }

describe('CommentForm', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('renders textarea and no error initially', () => {
    render(<CommentForm postId="post-1" onCommentAdded={jest.fn()} />)

    expect(screen.getByPlaceholderText(/write a comment/i)).toBeInTheDocument()
    expect(screen.queryByText(/comment is too long/i)).not.toBeInTheDocument()
  })

  it('shows error if comment exceeds max length', () => {
    render(<CommentForm postId="post-1" onCommentAdded={jest.fn()} />)

    const longText = 'a'.repeat(2201)
    const textarea = screen.getByPlaceholderText(/write a comment/i)

    fireEvent.change(textarea, { target: { value: longText } })

    fireEvent.submit(screen.getByTestId('comment-form'))

    expect(screen.getByText(/comment is too long/i)).toBeInTheDocument()
  })
})
