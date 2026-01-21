/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PostModal from '@/components/posts/PostModal'
import { useUser } from '@/context/userContext'
import '@testing-library/jest-dom'
import { Post } from '@/types/post'
import { Comment } from '@/types/comment'

// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({
    src,
    alt,
    fill,
    blurDataURL,
    ...props
  }: {
    src: string
    alt: string
    fill?: boolean
    blurDataURL?: string
    [key: string]: unknown
  }) {
    return <img src={src} alt={alt} {...props} />
  }
})

// Mock child components
jest.mock('@/components/posts/PostModalUserInfo', () => {
  return function MockUserInfo({
    username,
    avatar,
    createdAt,
  }: {
    username: string
    avatar: string
    createdAt: string
    userID: string
  }) {
    return (
      <div data-testid="user-info">
        <img src={avatar} alt={`${username} avatar`} />
        <span>{username}</span>
        <span>{createdAt}</span>
      </div>
    )
  }
})

jest.mock('@/components/posts/PostModalPostActions', () => {
  return function MockPostActions({
    canEdit,
    isLiked,
    isSaved,
    likesCount,
    onDelete,
    onEdit,
    onToggleLike,
    onToggleSave,
  }: {
    canEdit: boolean
    isLiked: boolean
    isSaved: boolean
    likesCount: number
    onDelete: () => void
    onEdit: () => void
    onToggleLike: () => void
    onToggleSave: () => void
  }) {
    return (
      <div data-testid="post-actions">
        <button onClick={onToggleLike} data-testid="like-button">
          {isLiked ? 'Unlike' : 'Like'} ({likesCount})
        </button>
        <button onClick={onToggleSave} data-testid="save-button">
          {isSaved ? 'Unsave' : 'Save'}
        </button>
        {canEdit && (
          <>
            <button onClick={onEdit} data-testid="edit-button">
              Edit
            </button>
            <button onClick={onDelete} data-testid="delete-button">
              Delete
            </button>
          </>
        )}
      </div>
    )
  }
})

jest.mock('@/components/posts/CommentsList', () => {
  return function MockCommentsList({
    currentUserId,
    comments,
    onCommentDeleted,
  }: {
    currentUserId: string
    comments: Comment[]
    onCommentDeleted: (commentId: string) => void
    postAuthorId: string
  }) {
    return (
      <div data-testid="comments-list">
        {comments.map((comment: Comment) => (
          <div key={comment.id} data-testid={`comment-${comment.id}`}>
            <span>{comment.content}</span>
            {comment.user.id === currentUserId && (
              <button
                onClick={() => onCommentDeleted(comment.id)}
                data-testid={`delete-comment-${comment.id}`}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    )
  }
})

jest.mock('@/components/posts/AddCommentForm', () => {
  return function MockCommentForm({
    onCommentAdded,
  }: {
    postId: string
    onCommentAdded: (comment: Comment) => void
  }) {
    return (
      <div data-testid="comment-form">
        <input placeholder="Write a comment..." />
        <button
          onClick={() =>
            onCommentAdded({
              id: 'new-comment',
              content: 'New comment',
              createdAt: '2024-01-01T12:00:00.000Z',
              postId: 'post-1',
              user: {
                id: 'user-1',
                name: 'John Doe',
                username: 'johndoe',
                image: '/avatar1.jpg',
                posts: [],
                _count: { posts: 0, followers: 0, following: 0 },
                followers: [],
                following: [],
                savedPosts: [],
              },
            })
          }
        >
          Post
        </button>
      </div>
    )
  }
})

// Mock userContext
jest.mock('@/context/userContext', () => ({
  useUser: jest.fn(),
}))

// Mock window.innerWidth and window.innerHeight
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
})

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768,
})

describe('PostModal', () => {
  const mockOnClose = jest.fn()
  const mockOnCommentAdded = jest.fn()
  const mockEditPost = jest.fn()
  const mockToggleLike = jest.fn()
  const mockDeletePost = jest.fn()
  const mockDeleteComment = jest.fn()
  const mockToggleSavePost = jest.fn()

  const mockComment: Comment = {
    id: 'comment-1',
    content: 'Test comment',
    createdAt: '2024-01-01T12:00:00.000Z',
    postId: 'post-1',
    user: {
      id: 'user-2',
      name: 'Jane Doe',
      username: 'jane',
      image: '/avatar2.jpg',
      posts: [],
      _count: { posts: 0, followers: 0, following: 0 },
      followers: [],
      following: [],
      savedPosts: [],
    },
  }

  const mockPost: Post = {
    id: 'post-1',
    image: '/post1.jpg',
    content: 'This is a test post with some content',
    createdAt: '2024-01-01T12:00:00.000Z',
    user: {
      id: 'user-1',
      name: 'John Doe',
      username: 'johndoe',
      image: '/avatar1.jpg',
      posts: [],
      _count: { posts: 0, followers: 0, following: 0 },
      followers: [],
      following: [],
      savedPosts: [],
    },
    comments: [mockComment],
    commentsCount: 1,
    likedByCurrentUser: false,
    savedByCurrentUser: false,
    likesCount: 5,
    blurDataURL: 'data:image/jpeg;base64,...',
  }

  beforeEach(() => {
    jest.clearAllMocks()

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      }),
    ) as jest.Mock
    ;(useUser as jest.Mock).mockReturnValue({
      editPost: mockEditPost,
      toggleLike: mockToggleLike,
      deletePost: mockDeletePost,
      deleteComment: mockDeleteComment,
      toggleSavePost: mockToggleSavePost,
    })
  })

  it('renders post modal with all elements', () => {
    render(
      <PostModal
        post={mockPost}
        image="/post1.jpg"
        onClose={mockOnClose}
        onCommentAdded={mockOnCommentAdded}
        currentUserId="user-1"
      />,
    )

    expect(screen.getByAltText('Post by johndoe')).toBeInTheDocument()
    expect(screen.getByTestId('user-info')).toBeInTheDocument()
    expect(screen.getByTestId('post-actions')).toBeInTheDocument()
    // Wait for comments to load
    waitFor(() => {
      expect(screen.getByTestId('comments-list')).toBeInTheDocument()
    })
    expect(screen.getByTestId('comment-form')).toBeInTheDocument()
    expect(
      screen.getByText('This is a test post with some content'),
    ).toBeInTheDocument()
  })

  it('displays post content correctly', () => {
    render(
      <PostModal
        post={mockPost}
        image="/post1.jpg"
        onClose={mockOnClose}
        onCommentAdded={mockOnCommentAdded}
        currentUserId="user-1"
      />,
    )

    expect(
      screen.getByText('This is a test post with some content'),
    ).toBeInTheDocument()
  })

  it('shows edit and delete buttons for post owner', () => {
    render(
      <PostModal
        post={mockPost}
        image="/post1.jpg"
        onClose={mockOnClose}
        onCommentAdded={mockOnCommentAdded}
        currentUserId="user-1" // Same as post owner
      />,
    )

    expect(screen.getByTestId('edit-button')).toBeInTheDocument()
    expect(screen.getByTestId('delete-button')).toBeInTheDocument()
  })

  it('does not show edit and delete buttons for non-owner', () => {
    render(
      <PostModal
        post={mockPost}
        image="/post1.jpg"
        onClose={mockOnClose}
        onCommentAdded={mockOnCommentAdded}
        currentUserId="user-2" // Different from post owner
      />,
    )

    expect(screen.queryByTestId('edit-button')).not.toBeInTheDocument()
    expect(screen.queryByTestId('delete-button')).not.toBeInTheDocument()
  })

  it('handles like button click', () => {
    render(
      <PostModal
        post={mockPost}
        image="/post1.jpg"
        onClose={mockOnClose}
        onCommentAdded={mockOnCommentAdded}
        currentUserId="user-1"
      />,
    )

    const likeButton = screen.getByTestId('like-button')
    fireEvent.click(likeButton)

    expect(mockToggleLike).toHaveBeenCalledWith('post-1')
  })

  it('handles save button click', () => {
    render(
      <PostModal
        post={mockPost}
        image="/post1.jpg"
        onClose={mockOnClose}
        onCommentAdded={mockOnCommentAdded}
        currentUserId="user-1"
      />,
    )

    const saveButton = screen.getByTestId('save-button')
    fireEvent.click(saveButton)

    expect(mockToggleSavePost).toHaveBeenCalledWith(mockPost)
  })

  it('handles delete button click', () => {
    render(
      <PostModal
        post={mockPost}
        image="/post1.jpg"
        onClose={mockOnClose}
        onCommentAdded={mockOnCommentAdded}
        currentUserId="user-1"
      />,
    )

    const deleteButton = screen.getByTestId('delete-button')
    fireEvent.click(deleteButton)

    expect(mockDeletePost).toHaveBeenCalledWith('post-1')
  })

  it('enters edit mode when edit button is clicked', () => {
    render(
      <PostModal
        post={mockPost}
        image="/post1.jpg"
        onClose={mockOnClose}
        onCommentAdded={mockOnCommentAdded}
        currentUserId="user-1"
      />,
    )

    const editButton = screen.getByTestId('edit-button')
    fireEvent.click(editButton)

    expect(screen.getByTestId('edit-post')).toBeInTheDocument()
    expect(screen.getByText('Save')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('saves edited content when save button is clicked', async () => {
    mockEditPost.mockResolvedValue(undefined)

    render(
      <PostModal
        post={mockPost}
        image="/post1.jpg"
        onClose={mockOnClose}
        onCommentAdded={mockOnCommentAdded}
        currentUserId="user-1"
      />,
    )

    // Enter edit mode
    const editButton = screen.getByTestId('edit-button')
    fireEvent.click(editButton)

    // Edit content
    const textarea = screen.getByTestId('edit-post')
    fireEvent.change(textarea, { target: { value: 'Updated content' } })

    // Save
    const saveButton = screen.getByText('Save')
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(mockEditPost).toHaveBeenCalledWith('post-1', 'Updated content')
    })
  })

  it('cancels edit mode when cancel button is clicked', () => {
    render(
      <PostModal
        post={mockPost}
        image="/post1.jpg"
        onClose={mockOnClose}
        onCommentAdded={mockOnCommentAdded}
        currentUserId="user-1"
      />,
    )

    // Enter edit mode
    const editButton = screen.getByTestId('edit-button')
    fireEvent.click(editButton)

    expect(screen.getByTestId('edit-post')).toBeInTheDocument()

    // Cancel
    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)

    expect(screen.queryByTestId('edit-post')).not.toBeInTheDocument()
    expect(
      screen.getByText('This is a test post with some content'),
    ).toBeInTheDocument()
  })

  it('saves on Enter key press in edit mode', async () => {
    mockEditPost.mockResolvedValue(undefined)

    render(
      <PostModal
        post={mockPost}
        image="/post1.jpg"
        onClose={mockOnClose}
        onCommentAdded={mockOnCommentAdded}
        currentUserId="user-1"
      />,
    )

    // Enter edit mode
    const editButton = screen.getByTestId('edit-button')
    fireEvent.click(editButton)

    // Edit content and press Enter
    const textarea = screen.getByTestId('edit-post')
    fireEvent.change(textarea, { target: { value: 'Updated content' } })
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false })

    await waitFor(() => {
      expect(mockEditPost).toHaveBeenCalledWith('post-1', 'Updated content')
    })
  })

  it('does not save on Shift+Enter in edit mode', () => {
    render(
      <PostModal
        post={mockPost}
        image="/post1.jpg"
        onClose={mockOnClose}
        onCommentAdded={mockOnCommentAdded}
        currentUserId="user-1"
      />,
    )

    // Enter edit mode
    const editButton = screen.getByTestId('edit-button')
    fireEvent.click(editButton)

    // Press Shift+Enter
    const textarea = screen.getByTestId('edit-post')
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true })

    expect(mockEditPost).not.toHaveBeenCalled()
  })

  it('closes modal when close button is clicked', () => {
    render(
      <PostModal
        post={mockPost}
        image="/post1.jpg"
        onClose={mockOnClose}
        onCommentAdded={mockOnCommentAdded}
        currentUserId="user-1"
      />,
    )

    const closeButton = screen.getByText('×')
    fireEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('closes modal when overlay is clicked', () => {
    render(
      <PostModal
        post={mockPost}
        image="/post1.jpg"
        onClose={mockOnClose}
        onCommentAdded={mockOnCommentAdded}
        currentUserId="user-1"
      />,
    )

    const overlay = screen.getByText('×').closest('div')?.parentElement
    if (overlay) {
      fireEvent.click(overlay)
      expect(mockOnClose).toHaveBeenCalled()
    }
  })

  it('does not close modal when modal content is clicked', () => {
    render(
      <PostModal
        post={mockPost}
        image="/post1.jpg"
        onClose={mockOnClose}
        onCommentAdded={mockOnCommentAdded}
        currentUserId="user-1"
      />,
    )

    const modalContent = screen.getByTestId('user-info')
    fireEvent.click(modalContent)

    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('closes modal on Escape key press', () => {
    render(
      <PostModal
        post={mockPost}
        image="/post1.jpg"
        onClose={mockOnClose}
        onCommentAdded={mockOnCommentAdded}
        currentUserId="user-1"
      />,
    )

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('shows "show all" button for long content', () => {
    const longContentPost = {
      ...mockPost,
      content: 'a'.repeat(600), // Longer than MAX_CHARS (500)
    }

    render(
      <PostModal
        post={longContentPost}
        image="/post1.jpg"
        onClose={mockOnClose}
        onCommentAdded={mockOnCommentAdded}
        currentUserId="user-1"
      />,
    )

    expect(screen.getByText('...show all')).toBeInTheDocument()
  })

  it('expands content when "show all" button is clicked', () => {
    const longContentPost = {
      ...mockPost,
      content: 'a'.repeat(600),
    }

    render(
      <PostModal
        post={longContentPost}
        image="/post1.jpg"
        onClose={mockOnClose}
        onCommentAdded={mockOnCommentAdded}
        currentUserId="user-1"
      />,
    )

    const showAllButton = screen.getByText('...show all')
    fireEvent.click(showAllButton)

    expect(screen.queryByText('...show all')).not.toBeInTheDocument()
    expect(screen.getByText(longContentPost.content)).toBeInTheDocument()
  })

  it('handles comment deletion', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([mockComment]),
      }),
    ) as jest.Mock

    render(
      <PostModal
        post={mockPost}
        image="/post1.jpg"
        onClose={mockOnClose}
        onCommentAdded={mockOnCommentAdded}
        currentUserId="user-2" // Same as comment author
      />,
    )

    const deleteCommentButton = await screen.findByTestId(
      'delete-comment-comment-1',
    )
    fireEvent.click(deleteCommentButton)

    expect(mockDeleteComment).toHaveBeenCalledWith('post-1', 'comment-1')
  })

  it('handles new comment addition', () => {
    render(
      <PostModal
        post={mockPost}
        image="/post1.jpg"
        onClose={mockOnClose}
        onCommentAdded={mockOnCommentAdded}
        currentUserId="user-1"
      />,
    )

    const postButton = screen.getByText('Post')
    fireEvent.click(postButton)

    expect(mockOnCommentAdded).toHaveBeenCalledWith({
      id: 'new-comment',
      content: 'New comment',
      createdAt: '2024-01-01T12:00:00.000Z',
      postId: 'post-1',
      user: {
        id: 'user-1',
        name: 'John Doe',
        username: 'johndoe',
        image: '/avatar1.jpg',
        posts: [],
        _count: { posts: 0, followers: 0, following: 0 },
        followers: [],
        following: [],
        savedPosts: [],
      },
    })
  })

  it('displays correct like and save states', () => {
    const likedAndSavedPost = {
      ...mockPost,
      likedByCurrentUser: true,
      savedByCurrentUser: true,
    }

    render(
      <PostModal
        post={likedAndSavedPost}
        image="/post1.jpg"
        onClose={mockOnClose}
        onCommentAdded={mockOnCommentAdded}
        currentUserId="user-1"
      />,
    )

    expect(screen.getByText('Unlike (5)')).toBeInTheDocument()
    expect(screen.getByText('Unsave')).toBeInTheDocument()
  })

  it('handles empty post content', () => {
    const emptyContentPost = {
      ...mockPost,
      content: '',
    }

    render(
      <PostModal
        post={emptyContentPost}
        image="/post1.jpg"
        onClose={mockOnClose}
        onCommentAdded={mockOnCommentAdded}
        currentUserId="user-1"
      />,
    )

    // Should not crash and should render the modal
    expect(screen.getByTestId('user-info')).toBeInTheDocument()
    expect(screen.getByTestId('post-actions')).toBeInTheDocument()
  })

  it('handles null post content', () => {
    const nullContentPost = {
      ...mockPost,
      content: null as unknown as string,
    }

    render(
      <PostModal
        post={nullContentPost}
        image="/post1.jpg"
        onClose={mockOnClose}
        onCommentAdded={mockOnCommentAdded}
        currentUserId="user-1"
      />,
    )

    // Should not crash and should render the modal
    expect(screen.getByTestId('user-info')).toBeInTheDocument()
    expect(screen.getByTestId('post-actions')).toBeInTheDocument()
  })

  it('shows loading state when saving', async () => {
    mockEditPost.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    )

    render(
      <PostModal
        post={mockPost}
        image="/post1.jpg"
        onClose={mockOnClose}
        onCommentAdded={mockOnCommentAdded}
        currentUserId="user-1"
      />,
    )

    // Enter edit mode
    const editButton = screen.getByTestId('edit-button')
    fireEvent.click(editButton)

    // Start saving
    const saveButton = screen.getByText('Save')
    fireEvent.click(saveButton)

    // Check loading state
    expect(screen.getByText('Saving...')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeDisabled()

    await waitFor(() => {
      expect(screen.getByText('Save')).toBeInTheDocument()
    })
  })
})
