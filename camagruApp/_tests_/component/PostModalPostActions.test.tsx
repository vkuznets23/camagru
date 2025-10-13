import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PostActions from '@/components/posts/PostModalPostActions'
import '@testing-library/jest-dom'

// Mock react-icons
jest.mock('react-icons/md', () => ({
  MdOutlineEdit: () => <span data-testid="edit-icon">Edit</span>,
}))

jest.mock('react-icons/ri', () => ({
  RiDeleteBin6Line: () => <span data-testid="delete-icon">Delete</span>,
}))

jest.mock('react-icons/fa', () => ({
  FaRegBookmark: () => (
    <span data-testid="bookmark-outline-icon">Bookmark</span>
  ),
  FaBookmark: () => <span data-testid="bookmark-filled-icon">Bookmark</span>,
}))

jest.mock('react-icons/fc', () => ({
  FcLike: () => <span data-testid="like-filled-icon">Like</span>,
}))

jest.mock('react-icons/fi', () => ({
  FiHeart: () => <span data-testid="heart-outline-icon">Heart</span>,
}))

describe('PostActions', () => {
  const mockOnDelete = jest.fn()
  const mockOnEdit = jest.fn()
  const mockOnToggleLike = jest.fn()
  const mockOnToggleSave = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    // Mock console.error to avoid noise in test output
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  const defaultProps = {
    canEdit: false,
    isLiked: false,
    isSaved: false,
    likesCount: 5,
    onDelete: mockOnDelete,
    onEdit: mockOnEdit,
    onToggleLike: mockOnToggleLike,
    onToggleSave: mockOnToggleSave,
  }

  it('renders like and save buttons', () => {
    render(<PostActions {...defaultProps} />)

    expect(screen.getByTestId('likeBtn')).toBeInTheDocument()
    expect(screen.getByTestId('saveBtn')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renders edit and delete buttons when canEdit is true', () => {
    render(<PostActions {...defaultProps} canEdit={true} />)

    expect(screen.getByLabelText('Edit post')).toBeInTheDocument()
    expect(screen.getByLabelText('Delete post')).toBeInTheDocument()
  })

  it('does not render edit and delete buttons when canEdit is false', () => {
    render(<PostActions {...defaultProps} canEdit={false} />)

    expect(screen.queryByLabelText('Edit post')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Delete post')).not.toBeInTheDocument()
  })

  it('displays correct like state when not liked', () => {
    render(<PostActions {...defaultProps} isLiked={false} />)

    expect(screen.getByTestId('heart-outline-icon')).toBeInTheDocument()
    expect(screen.queryByTestId('like-filled-icon')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Like post (5 likes)')).toBeInTheDocument()
  })

  it('displays correct like state when liked', () => {
    render(<PostActions {...defaultProps} isLiked={true} />)

    expect(screen.getByTestId('like-filled-icon')).toBeInTheDocument()
    expect(screen.queryByTestId('heart-outline-icon')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Unlike post (5 likes)')).toBeInTheDocument()
  })

  it('displays correct save state when not saved', () => {
    render(<PostActions {...defaultProps} isSaved={false} />)

    expect(screen.getByTestId('bookmark-outline-icon')).toBeInTheDocument()
    expect(screen.queryByTestId('bookmark-filled-icon')).not.toBeInTheDocument()
    expect(screen.getByText('Save')).toBeInTheDocument()
    expect(screen.getByLabelText('Save post')).toBeInTheDocument()
  })

  it('displays correct save state when saved', () => {
    render(<PostActions {...defaultProps} isSaved={true} />)

    expect(screen.getByTestId('bookmark-filled-icon')).toBeInTheDocument()
    expect(
      screen.queryByTestId('bookmark-outline-icon')
    ).not.toBeInTheDocument()
    expect(screen.getByText('Saved')).toBeInTheDocument()
    expect(screen.getByLabelText('Unsave post')).toBeInTheDocument()
  })

  it('calls onDelete when delete button is clicked', () => {
    render(<PostActions {...defaultProps} canEdit={true} />)

    const deleteButton = screen.getByLabelText('Delete post')
    fireEvent.click(deleteButton)

    expect(mockOnDelete).toHaveBeenCalledTimes(1)
  })

  it('calls onEdit when edit button is clicked', () => {
    render(<PostActions {...defaultProps} canEdit={true} />)

    const editButton = screen.getByLabelText('Edit post')
    fireEvent.click(editButton)

    expect(mockOnEdit).toHaveBeenCalledTimes(1)
  })

  it('handles like button click successfully', async () => {
    mockOnToggleLike.mockResolvedValue(undefined)

    render(<PostActions {...defaultProps} isLiked={false} likesCount={5} />)

    const likeButton = screen.getByTestId('likeBtn')
    fireEvent.click(likeButton)

    // Check optimistic update
    expect(screen.getByTestId('like-filled-icon')).toBeInTheDocument()
    expect(screen.getByText('6')).toBeInTheDocument()
    expect(likeButton).toBeDisabled()

    await waitFor(() => {
      expect(mockOnToggleLike).toHaveBeenCalledTimes(1)
      expect(likeButton).not.toBeDisabled()
    })
  })

  it('handles like button click with error and reverts state', async () => {
    mockOnToggleLike.mockRejectedValue(new Error('Network error'))

    render(<PostActions {...defaultProps} isLiked={false} likesCount={5} />)

    const likeButton = screen.getByTestId('likeBtn')
    fireEvent.click(likeButton)

    // Check optimistic update
    expect(screen.getByTestId('like-filled-icon')).toBeInTheDocument()
    expect(screen.getByText('6')).toBeInTheDocument()

    await waitFor(() => {
      // Should revert to original state
      expect(screen.getByTestId('heart-outline-icon')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(likeButton).not.toBeDisabled()
    })
  })

  it('handles unlike button click successfully', async () => {
    mockOnToggleLike.mockResolvedValue(undefined)

    render(<PostActions {...defaultProps} isLiked={true} likesCount={5} />)

    const likeButton = screen.getByTestId('likeBtn')
    fireEvent.click(likeButton)

    // Check optimistic update
    expect(screen.getByTestId('heart-outline-icon')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(likeButton).toBeDisabled()

    await waitFor(() => {
      expect(mockOnToggleLike).toHaveBeenCalledTimes(1)
      expect(likeButton).not.toBeDisabled()
    })
  })

  it('handles save button click successfully', async () => {
    mockOnToggleSave.mockResolvedValue(undefined)

    render(<PostActions {...defaultProps} isSaved={false} />)

    const saveButton = screen.getByTestId('saveBtn')
    fireEvent.click(saveButton)

    // Check optimistic update
    expect(screen.getByTestId('bookmark-filled-icon')).toBeInTheDocument()
    expect(screen.getByText('Saved')).toBeInTheDocument()
    expect(saveButton).toBeDisabled()

    await waitFor(() => {
      expect(mockOnToggleSave).toHaveBeenCalledTimes(1)
      expect(saveButton).not.toBeDisabled()
    })
  })

  it('handles unsave button click successfully', async () => {
    mockOnToggleSave.mockResolvedValue(undefined)

    render(<PostActions {...defaultProps} isSaved={true} />)

    const saveButton = screen.getByTestId('saveBtn')
    fireEvent.click(saveButton)

    // Check optimistic update
    expect(screen.getByTestId('bookmark-outline-icon')).toBeInTheDocument()
    expect(screen.getByText('Save')).toBeInTheDocument()
    expect(saveButton).toBeDisabled()

    await waitFor(() => {
      expect(mockOnToggleSave).toHaveBeenCalledTimes(1)
      expect(saveButton).not.toBeDisabled()
    })
  })

  it('handles save button click with error and reverts state', async () => {
    mockOnToggleSave.mockRejectedValue(new Error('Network error'))

    render(<PostActions {...defaultProps} isSaved={false} />)

    const saveButton = screen.getByTestId('saveBtn')
    fireEvent.click(saveButton)

    // Check optimistic update
    expect(screen.getByTestId('bookmark-filled-icon')).toBeInTheDocument()
    expect(screen.getByText('Saved')).toBeInTheDocument()

    await waitFor(() => {
      // Should revert to original state
      expect(screen.getByTestId('bookmark-outline-icon')).toBeInTheDocument()
      expect(screen.getByText('Save')).toBeInTheDocument()
      expect(saveButton).not.toBeDisabled()
    })
  })

  it('prevents multiple like clicks while processing', async () => {
    mockOnToggleLike.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    )

    render(<PostActions {...defaultProps} isLiked={false} />)

    const likeButton = screen.getByTestId('likeBtn')

    // Click multiple times
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(mockOnToggleLike).toHaveBeenCalledTimes(1)
    expect(likeButton).toBeDisabled()

    await waitFor(() => {
      expect(likeButton).not.toBeDisabled()
    })
  })

  it('prevents multiple save clicks while processing', async () => {
    mockOnToggleSave.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    )

    render(<PostActions {...defaultProps} isSaved={false} />)

    const saveButton = screen.getByTestId('saveBtn')

    // Click multiple times
    fireEvent.click(saveButton)
    fireEvent.click(saveButton)
    fireEvent.click(saveButton)

    expect(mockOnToggleSave).toHaveBeenCalledTimes(1)
    expect(saveButton).toBeDisabled()

    await waitFor(() => {
      expect(saveButton).not.toBeDisabled()
    })
  })

  it('displays correct likes count', () => {
    render(<PostActions {...defaultProps} likesCount={42} />)

    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByLabelText('Like post (42 likes)')).toBeInTheDocument()
  })

  it('displays zero likes count', () => {
    render(<PostActions {...defaultProps} likesCount={0} />)

    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByLabelText('Like post (0 likes)')).toBeInTheDocument()
  })

  it('has correct accessibility attributes', () => {
    render(
      <PostActions
        {...defaultProps}
        canEdit={true}
        isLiked={true}
        isSaved={true}
      />
    )

    expect(screen.getByLabelText('Delete post')).toBeInTheDocument()
    expect(screen.getByLabelText('Edit post')).toBeInTheDocument()
    expect(screen.getByLabelText('Unlike post (5 likes)')).toBeInTheDocument()
    expect(screen.getByLabelText('Unsave post')).toBeInTheDocument()
  })

  it('updates aria-label when like state changes', async () => {
    mockOnToggleLike.mockResolvedValue(undefined)

    render(<PostActions {...defaultProps} isLiked={false} likesCount={5} />)

    const likeButton = screen.getByTestId('likeBtn')

    expect(screen.getByLabelText('Like post (5 likes)')).toBeInTheDocument()

    fireEvent.click(likeButton)

    await waitFor(() => {
      expect(screen.getByLabelText('Unlike post (6 likes)')).toBeInTheDocument()
    })
  })

  it('updates aria-label when save state changes', async () => {
    mockOnToggleSave.mockResolvedValue(undefined)

    render(<PostActions {...defaultProps} isSaved={false} />)

    const saveButton = screen.getByTestId('saveBtn')

    expect(screen.getByLabelText('Save post')).toBeInTheDocument()

    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByLabelText('Unsave post')).toBeInTheDocument()
    })
  })
})
