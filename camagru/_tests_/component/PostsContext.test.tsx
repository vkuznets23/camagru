import React from 'react'
import { render, act } from '@testing-library/react'
import { PostsProvider, usePosts } from '@/context/PostsContext'

const mockPosts = [
  {
    id: '1',
    image: '/img1.jpg',
    content: 'Post 1',
    createdAt: '2024-01-01T12:00:00.000Z',
    user: {
      id: 'user-1',
      name: 'User One',
      username: 'userone',
      image: '/avatar1.jpg',
      posts: [],
      _count: { posts: 1, followers: 0, following: 0 },
      followers: [],
      following: [],
      savedPosts: [],
    },
    comments: [
      {
        id: 'c1',
        content: 'Comment 1',
        createdAt: '2024-01-01T13:00:00.000Z',
        postId: '1',
        user: {
          id: 'user-2',
          name: 'User Two',
          username: 'usertwo',
          image: '/avatar2.jpg',
          posts: [],
          _count: { posts: 1, followers: 0, following: 0 },
          followers: [],
          following: [],
          savedPosts: [],
        },
      },
    ],
    likedByCurrentUser: false,
    likesCount: 0,
  },
  {
    id: '2',
    image: '/img2.jpg',
    content: 'Post 2',
    createdAt: '2024-01-02T12:00:00.000Z',
    user: {
      id: 'user-2',
      name: 'User Two',
      username: 'usertwo',
      image: '/avatar2.jpg',
      posts: [],
      _count: { posts: 2, followers: 0, following: 0 },
      followers: [],
      following: [],
      savedPosts: [],
    },
    comments: [],
    likedByCurrentUser: true,
    likesCount: 5,
  },
]

function TestComponent() {
  const {
    posts,
    handleEditPost,
    handleToggleLike,
    handlePostDeleted,
    handleCommentDeleted,
  } = usePosts()

  return (
    <div>
      <button onClick={() => handleEditPost('1', 'Updated content')}>
        Edit Post
      </button>
      <button onClick={() => handleToggleLike('1')}>Toggle Like</button>
      <button onClick={() => handlePostDeleted('1')}>Delete Post</button>
      <button onClick={() => handleCommentDeleted('1', 'c1')}>
        Delete Comment
      </button>
      <ul>
        {posts.map((post) => (
          <li key={post.id} data-testid={`post-${post.id}`}>
            {post.content} - Likes: {post.likesCount} - Comments:{' '}
            {post.comments.length}
          </li>
        ))}
      </ul>
    </div>
  )
}

describe('PostsProvider and usePosts', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
    jest.resetAllMocks()
  })

  it('provides initial posts', () => {
    const { getByTestId } = render(
      <PostsProvider initialPosts={mockPosts}>
        <TestComponent />
      </PostsProvider>
    )

    expect(getByTestId('post-1')).toHaveTextContent('Post 1')
    expect(getByTestId('post-2')).toHaveTextContent('Post 2')
  })

  it('handleEditPost updates post content', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ content: 'Updated content' }),
      } as Response)
    )

    const { getByText, getByTestId } = render(
      <PostsProvider initialPosts={mockPosts}>
        <TestComponent />
      </PostsProvider>
    )

    await act(async () => {
      getByText('Edit Post').click()
    })

    expect(getByTestId('post-1')).toHaveTextContent('Updated content')
  })

  it('handleToggleLike updates like state', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ likedByCurrentUser: true, likesCount: 1 }),
      } as Response)
    )

    const { getByText, getByTestId } = render(
      <PostsProvider initialPosts={mockPosts}>
        <TestComponent />
      </PostsProvider>
    )

    await act(async () => {
      getByText('Toggle Like').click()
    })

    expect(getByTestId('post-1')).toHaveTextContent('Likes: 1')
  })

  it('handlePostDeleted removes post', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
      } as Response)
    )

    const { getByText, queryByTestId } = render(
      <PostsProvider initialPosts={mockPosts}>
        <TestComponent />
      </PostsProvider>
    )

    await act(async () => {
      getByText('Delete Post').click()
    })

    expect(queryByTestId('post-1')).toBeNull()
  })

  it('handleCommentDeleted removes comment from post', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
      } as Response)
    )

    const { getByText, getByTestId } = render(
      <PostsProvider initialPosts={mockPosts}>
        <TestComponent />
      </PostsProvider>
    )

    expect(getByTestId('post-1')).toHaveTextContent('Comments: 1')

    await act(async () => {
      getByText('Delete Comment').click()
    })

    expect(getByTestId('post-1')).toHaveTextContent('Comments: 0')
  })
})
