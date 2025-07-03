import { fireEvent, render, screen } from '@testing-library/react'
import CommentList from '@/components/posts/CommentsList'
import '@testing-library/jest-dom'
import { type Comment } from '@/types/comment'

const comments: Comment[] = [
  {
    id: 'comment-1',
    content: 'First comment',
    createdAt: '2023-01-01T12:00:00.000Z',
    postId: 'post-1',
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
  },
  {
    id: 'comment-2',
    content: 'Second comment',
    createdAt: '2023-01-02T12:00:00.000Z',
    postId: 'post-1',
    user: {
      id: 'user-2',
      name: 'John Doeee2',
      username: 'jdoen',
      image: '/avatar.jpg',
      posts: [],
      _count: { posts: 2, followers: 0, following: 0 },
      followers: [],
      following: [],
      savedPosts: [],
    },
  },
]

describe('CommentList', () => {
  it('renders "No comments yet" message when comments array is empty', () => {
    render(
      <CommentList
        comments={[]}
        onCommentDeleted={jest.fn()}
        currentUserId="user-1"
        postAuthorId="user-1"
      />
    )

    expect(screen.getByText(/no comments yet/i)).toBeInTheDocument()
  })

  it('renders a list of comments with user info and content', () => {
    render(
      <CommentList
        comments={comments}
        onCommentDeleted={jest.fn()}
        currentUserId="user-1"
        postAuthorId="user-1"
      />
    )

    expect(screen.getByText('First comment')).toBeInTheDocument()
    expect(screen.getByText('Second comment')).toBeInTheDocument()
    expect(screen.getByText('jdoe')).toBeInTheDocument()
    expect(screen.getByText('jdoen')).toBeInTheDocument()
  })

  it('calls onCommentDeleted with correct comment id when delete button is clicked', () => {
    const onCommentDeletedMock = jest.fn()

    // Передаем currentUserId так, чтобы был доступ к удалению (например, первый пользователь — автор комментария)
    render(
      <CommentList
        comments={comments}
        onCommentDeleted={onCommentDeletedMock}
        currentUserId="user-1"
        postAuthorId="user-3" // можно любой, просто чтобы не был user-1
      />
    )

    // Кнопка удаления будет только у комментария с user.id === currentUserId или если currentUserId === postAuthorId
    // Здесь только первый комментарий должен иметь кнопку delete

    // Проверим, что кнопка Delete в документе для первого комментария
    const deleteButtons = screen.getAllByText('Delete')
    expect(deleteButtons.length).toBe(1)

    // Кликнем по кнопке Delete первого комментария
    fireEvent.click(deleteButtons[0])

    // Проверим, что коллбэк вызвался с правильным id
    expect(onCommentDeletedMock).toHaveBeenCalledTimes(1)
    expect(onCommentDeletedMock).toHaveBeenCalledWith('comment-1')
  })
})
