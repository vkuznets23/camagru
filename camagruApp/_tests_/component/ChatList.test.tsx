import { render, screen, fireEvent } from '@testing-library/react'
import ChatList from '@/components/chat/chatList'
import { useChatContext } from '@/contexts/ChatContext'
import { useChatSidebar } from '@/contexts/ChatSidebarContext'
import { usePathname } from 'next/navigation'
import '@testing-library/jest-dom'

// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({
    src,
    alt,
    width,
    height,
    className,
  }: {
    src: string
    alt: string
    width: number
    height: number
    className?: string
  }) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    )
  }
})

// Mock contexts
jest.mock('@/contexts/ChatContext', () => ({
  useChatContext: jest.fn(),
}))

jest.mock('@/contexts/ChatSidebarContext', () => ({
  useChatSidebar: jest.fn(),
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

describe('ChatList', () => {
  const mockRefreshChats = jest.fn()
  const mockSelectChat = jest.fn()

  const mockChats = [
    {
      id: 'chat-1',
      name: 'John Doe',
      image: '/avatar1.jpg',
      lastMessage: 'Hello, how are you?',
      unreadCount: 2,
    },
    {
      id: 'chat-2',
      name: 'Jane Smith',
      image: null,
      lastMessage: 'See you later!',
      unreadCount: 0,
    },
    {
      id: 'chat-3',
      name: 'Bob Wilson',
      image: '/avatar3.jpg',
      lastMessage: {
        content: 'Thanks for the help!',
        text: 'Thanks for the help!',
      },
      unreadCount: 5,
    },
    {
      id: 'chat-4',
      name: 'Alice Brown',
      image: '/avatar4.jpg',
      lastMessage: null,
      unreadCount: 0,
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useChatContext as jest.Mock).mockReturnValue({
      chats: mockChats,
      refreshChats: mockRefreshChats,
    })
    ;(useChatSidebar as jest.Mock).mockReturnValue({
      selectChat: mockSelectChat,
    })
    ;(usePathname as jest.Mock).mockReturnValue('/chat')
  })

  it('renders list of chats', () => {
    render(<ChatList />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Bob Wilson')).toBeInTheDocument()
    expect(screen.getByText('Alice Brown')).toBeInTheDocument()
  })

  it('displays chat avatars', () => {
    render(<ChatList />)

    expect(screen.getByAltText('John Doe')).toHaveAttribute(
      'src',
      '/avatar1.jpg'
    )
    expect(screen.getByAltText('Jane Smith')).toHaveAttribute(
      'src',
      '/default_avatar.png'
    )
    expect(screen.getByAltText('Bob Wilson')).toHaveAttribute(
      'src',
      '/avatar3.jpg'
    )
    expect(screen.getByAltText('Alice Brown')).toHaveAttribute(
      'src',
      '/avatar4.jpg'
    )
  })

  it('displays last messages', () => {
    render(<ChatList />)

    expect(screen.getByText('Hello, how are you?')).toBeInTheDocument()
    expect(screen.getByText('See you later!')).toBeInTheDocument()
    expect(screen.getByText('Thanks for the help!')).toBeInTheDocument()
  })

  it('displays "No messages yet" for chats without last message', () => {
    render(<ChatList />)

    expect(screen.getByText('No messages yet')).toBeInTheDocument()
  })

  it('displays unread count badges', () => {
    render(<ChatList />)

    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('displays "99+" for unread counts over 99', () => {
    const chatsWithHighUnread = [
      {
        ...mockChats[0],
        unreadCount: 150,
      },
    ]

    ;(useChatContext as jest.Mock).mockReturnValue({
      chats: chatsWithHighUnread,
      refreshChats: mockRefreshChats,
    })

    render(<ChatList />)

    expect(screen.getByText('99+')).toBeInTheDocument()
  })

  it('handles string lastMessage', () => {
    render(<ChatList />)

    expect(screen.getByText('Hello, how are you?')).toBeInTheDocument()
  })

  it('handles object lastMessage with content', () => {
    render(<ChatList />)

    expect(screen.getByText('Thanks for the help!')).toBeInTheDocument()
  })

  it('handles object lastMessage with text', () => {
    const chatsWithTextMessage = [
      {
        ...mockChats[0],
        lastMessage: {
          text: 'This is a text message',
        },
      },
    ]

    ;(useChatContext as jest.Mock).mockReturnValue({
      chats: chatsWithTextMessage,
      refreshChats: mockRefreshChats,
    })

    render(<ChatList />)

    expect(screen.getByText('This is a text message')).toBeInTheDocument()
  })

  it('calls selectChat when chat is clicked', () => {
    render(<ChatList />)

    const chatItem = screen.getByText('John Doe').closest('div')
    fireEvent.click(chatItem!)

    expect(mockSelectChat).toHaveBeenCalledWith('chat-1')
  })

  it('calls refreshChats on mount', () => {
    render(<ChatList />)

    expect(mockRefreshChats).toHaveBeenCalled()
  })

  it('does not highlight inactive chats', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/chat/chat-2')

    render(<ChatList />)

    const inactiveChat = screen.getByText('John Doe').closest('div')
    expect(inactiveChat).not.toHaveClass('active')
    expect(inactiveChat).not.toHaveAttribute('aria-current')
  })

  it('handles empty chats array', () => {
    ;(useChatContext as jest.Mock).mockReturnValue({
      chats: [],
      refreshChats: mockRefreshChats,
    })

    render(<ChatList />)

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
  })

  it('handles chat with empty lastMessage content', () => {
    const chatsWithEmptyMessage = [
      {
        ...mockChats[0],
        lastMessage: {
          content: '',
          text: '',
        },
      },
    ]

    ;(useChatContext as jest.Mock).mockReturnValue({
      chats: chatsWithEmptyMessage,
      refreshChats: mockRefreshChats,
    })

    render(<ChatList />)

    // The component shows empty string when content and text are both empty
    const lastMessageElement = screen
      .getByText('John Doe')
      .closest('div')
      ?.querySelector('.chatLastMessage')
    expect(lastMessageElement).toHaveTextContent('')
  })

  it('handles chat with null lastMessage', () => {
    const chatsWithNullMessage = [
      {
        ...mockChats[0],
        lastMessage: null,
      },
    ]

    ;(useChatContext as jest.Mock).mockReturnValue({
      chats: chatsWithNullMessage,
      refreshChats: mockRefreshChats,
    })

    render(<ChatList />)

    expect(screen.getByText('No messages yet')).toBeInTheDocument()
  })

  it('handles chat with undefined lastMessage', () => {
    const chatsWithUndefinedMessage = [
      {
        ...mockChats[0],
        lastMessage: undefined,
      },
    ]

    ;(useChatContext as jest.Mock).mockReturnValue({
      chats: chatsWithUndefinedMessage,
      refreshChats: mockRefreshChats,
    })

    render(<ChatList />)

    expect(screen.getByText('No messages yet')).toBeInTheDocument()
  })

  it('handles chat with zero unread count', () => {
    const chatsWithZeroUnread = [
      {
        ...mockChats[0],
        unreadCount: 0,
      },
    ]

    ;(useChatContext as jest.Mock).mockReturnValue({
      chats: chatsWithZeroUnread,
      refreshChats: mockRefreshChats,
    })

    render(<ChatList />)

    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('handles chat with null unread count', () => {
    const chatsWithNullUnread = [
      {
        ...mockChats[0],
        unreadCount: null,
      },
    ]

    ;(useChatContext as jest.Mock).mockReturnValue({
      chats: chatsWithNullUnread,
      refreshChats: mockRefreshChats,
    })

    render(<ChatList />)

    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('handles chat with undefined unread count', () => {
    const chatsWithUndefinedUnread = [
      {
        ...mockChats[0],
        unreadCount: undefined,
      },
    ]

    ;(useChatContext as jest.Mock).mockReturnValue({
      chats: chatsWithUndefinedUnread,
      refreshChats: mockRefreshChats,
    })

    render(<ChatList />)

    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('applies correct CSS classes for avatars', () => {
    render(<ChatList />)

    const avatarWithImage = screen.getByAltText('John Doe')
    const avatarWithoutImage = screen.getByAltText('Jane Smith')

    expect(avatarWithImage).not.toHaveClass('default')
    expect(avatarWithoutImage).toHaveClass('default')
  })

  it('handles long chat names', () => {
    const chatsWithLongName = [
      {
        ...mockChats[0],
        name: 'This is a very long chat name that should be displayed properly',
      },
    ]

    ;(useChatContext as jest.Mock).mockReturnValue({
      chats: chatsWithLongName,
      refreshChats: mockRefreshChats,
    })

    render(<ChatList />)

    expect(
      screen.getByText(
        'This is a very long chat name that should be displayed properly'
      )
    ).toBeInTheDocument()
  })

  it('handles special characters in chat names', () => {
    const chatsWithSpecialChars = [
      {
        ...mockChats[0],
        name: 'Chat with émojis 🎉 and spëcial chars!',
      },
    ]

    ;(useChatContext as jest.Mock).mockReturnValue({
      chats: chatsWithSpecialChars,
      refreshChats: mockRefreshChats,
    })

    render(<ChatList />)

    expect(
      screen.getByText('Chat with émojis 🎉 and spëcial chars!')
    ).toBeInTheDocument()
  })
})
