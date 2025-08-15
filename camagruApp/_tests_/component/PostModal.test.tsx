import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import PostModal from '@/components/posts/PostModal'
import { Post } from '@/types/post'
import { UserContext } from '@/context/userContext'
import userEvent from '@testing-library/user-event'

const mockPost: Post = {
  id: '1',
  image: '/post.jpg',
  content: 'Original content',
  createdAt: '2024-01-01T12:00:00.000Z',
  user: {
    id: 'user-1',
    name: 'John Doe',
    username: 'jdoe',
    image: '/avatar.jpg',
    posts: [],
    _count: { posts: 1, followers: 0, following: 0 },
    followers: [],
    following: [],
    savedPosts: [],
  },
  comments: [],
  likedByCurrentUser: false,
  likesCount: 5,
}

describe('PostModal', () => {
  const onClose = jest.fn()
  const onCommentAdded = jest.fn()
  const handleEditPost = jest.fn()
  const handleToggleLike = jest.fn()
  const handlePostDeleted = jest.fn()
  const handleCommentDeleted = jest.fn()

  function MockPostsProvider({ children }: { children: React.ReactNode }) {
    return (
      <UserContext.Provider
        value={{
          user: null,
          setUser: jest.fn(),
          posts: [mockPost],
          setPosts: jest.fn(),
          editPost: handleEditPost,
          toggleLike: handleToggleLike,
          deletePost: handlePostDeleted,
          deleteComment: handleCommentDeleted,
          handleCommentAdded: jest.fn(),
        }}
      >
        {children}
      </UserContext.Provider>
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('allows editing post content', async () => {
    render(
      <MockPostsProvider>
        <PostModal
          post={mockPost}
          image={mockPost.image}
          onClose={onClose}
          currentUserId="user-1"
          onCommentAdded={onCommentAdded}
        />
      </MockPostsProvider>
    )

    const editButton = screen.getByRole('button', { name: /edit/i })

    await userEvent.click(editButton)

    const textarea = screen.getByTestId('edit-post') as HTMLTextAreaElement
    expect(textarea.value).toBe('Original content')

    fireEvent.change(textarea, { target: { value: 'Updated content' } })

    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(handleEditPost).toHaveBeenCalledWith('1', 'Updated content')
    })
  })

  it('allows toggling like', async () => {
    render(
      <MockPostsProvider>
        <PostModal
          post={mockPost}
          image={mockPost.image}
          onClose={onClose}
          currentUserId="user-1"
          onCommentAdded={onCommentAdded}
        />
      </MockPostsProvider>
    )
    await act(async () => {
      fireEvent.click(screen.getByTestId('likeBtn'))
    })

    expect(handleToggleLike).toHaveBeenCalledWith('1')
  })

  it('allows deleting post', async () => {
    render(
      <MockPostsProvider>
        <PostModal
          post={mockPost}
          image={mockPost.image}
          onClose={onClose}
          currentUserId="user-1"
          onCommentAdded={onCommentAdded}
        />
      </MockPostsProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: /delete/i }))

    await waitFor(() => {
      expect(handlePostDeleted).toHaveBeenCalledWith('1')
    })
  })
})
