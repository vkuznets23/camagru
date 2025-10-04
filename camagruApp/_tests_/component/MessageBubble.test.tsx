import { render, screen } from '@testing-library/react'
import MessageBubble, { Message } from '@/components/chat/messageBubble'
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

describe('MessageBubble', () => {
  const mockMessage: Message = {
    id: 'message-1',
    content: 'Hello, how are you?',
    senderId: 'user-1',
    createdAt: '2024-01-01T12:00:00.000Z',
    sender: {
      username: 'johndoe',
      name: 'John Doe',
      image: '/avatar1.jpg',
    },
  }

  const mockMessageWithoutImage: Message = {
    id: 'message-2',
    content: 'This is a test message',
    senderId: 'user-2',
    createdAt: '2024-01-01T13:00:00.000Z',
    sender: {
      username: 'janedoe',
      name: 'Jane Doe',
    },
  }

  it('renders own message correctly', () => {
    render(<MessageBubble message={mockMessage} isOwn={true} />)

    expect(screen.getByText('Hello, how are you?')).toBeInTheDocument()
    // Check that time is displayed (format may vary by timezone)
    expect(screen.getByText(/\d{2}:\d{2}/)).toBeInTheDocument()
    expect(screen.queryByAltText('User avatar')).not.toBeInTheDocument()
  })

  it('renders other user message with avatar', () => {
    render(<MessageBubble message={mockMessage} isOwn={false} />)

    expect(screen.getByText('Hello, how are you?')).toBeInTheDocument()
    // Check that time is displayed (format may vary by timezone)
    expect(screen.getByText(/\d{2}:\d{2}/)).toBeInTheDocument()
    expect(screen.getByAltText('User avatar')).toBeInTheDocument()
    expect(screen.getByAltText('User avatar')).toHaveAttribute(
      'src',
      '/avatar1.jpg'
    )
  })

  it('renders other user message without avatar', () => {
    render(<MessageBubble message={mockMessageWithoutImage} isOwn={false} />)

    expect(screen.getByText('This is a test message')).toBeInTheDocument()
    // Check that time is displayed (format may vary by timezone)
    expect(screen.getByText(/\d{2}:\d{2}/)).toBeInTheDocument()
    expect(screen.getByAltText('User avatar')).toBeInTheDocument()
    expect(screen.getByAltText('User avatar')).toHaveAttribute(
      'src',
      '/default_avatar.png'
    )
  })

  it('displays time in correct format', () => {
    const morningMessage = {
      ...mockMessage,
      createdAt: '2024-01-01T09:30:00.000Z',
    }

    render(<MessageBubble message={morningMessage} isOwn={true} />)

    // Check that time is displayed in HH:MM format
    expect(screen.getByText(/\d{2}:\d{2}/)).toBeInTheDocument()
  })

  it('displays time for different times of day', () => {
    const afternoonMessage = {
      ...mockMessage,
      createdAt: '2024-01-01T15:45:00.000Z',
    }

    render(<MessageBubble message={afternoonMessage} isOwn={true} />)

    // Check that time is displayed in HH:MM format
    expect(screen.getByText(/\d{2}:\d{2}/)).toBeInTheDocument()
  })

  it('displays time for midnight', () => {
    const midnightMessage = {
      ...mockMessage,
      createdAt: '2024-01-01T00:00:00.000Z',
    }

    render(<MessageBubble message={midnightMessage} isOwn={true} />)

    // Check that time is displayed in HH:MM format
    expect(screen.getByText(/\d{2}:\d{2}/)).toBeInTheDocument()
  })

  it('displays time for end of day', () => {
    const endOfDayMessage = {
      ...mockMessage,
      createdAt: '2024-01-01T23:59:00.000Z',
    }

    render(<MessageBubble message={endOfDayMessage} isOwn={true} />)

    // Check that time is displayed in HH:MM format
    expect(screen.getByText(/\d{2}:\d{2}/)).toBeInTheDocument()
  })

  it('handles long message content', () => {
    const longMessage = {
      ...mockMessage,
      content:
        'This is a very long message that should be displayed properly in the message bubble without any issues or truncation.',
    }

    render(<MessageBubble message={longMessage} isOwn={true} />)

    expect(screen.getByText(longMessage.content)).toBeInTheDocument()
  })

  it('handles message with special characters', () => {
    const specialMessage = {
      ...mockMessage,
      content:
        'Hello! 👋 How are you? 😊 This has emojis and special chars: @#$%^&*()',
    }

    render(<MessageBubble message={specialMessage} isOwn={true} />)

    expect(screen.getByText(specialMessage.content)).toBeInTheDocument()
  })

  it('handles empty message content', () => {
    const emptyMessage = {
      ...mockMessage,
      content: '',
    }

    render(<MessageBubble message={emptyMessage} isOwn={true} />)

    // Check that time is displayed even with empty content
    expect(screen.getByText(/\d{2}:\d{2}/)).toBeInTheDocument()
  })

  it('handles message with line breaks', () => {
    const multilineMessage = {
      ...mockMessage,
      content: 'Line 1\nLine 2\nLine 3',
    }

    render(<MessageBubble message={multilineMessage} isOwn={true} />)

    // Check that the message content is displayed (may be normalized by React)
    expect(screen.getByText(/Line 1.*Line 2.*Line 3/)).toBeInTheDocument()
  })

  it('applies correct CSS classes for own message', () => {
    const { container } = render(
      <MessageBubble message={mockMessage} isOwn={true} />
    )

    const messageContainer = container.firstChild as HTMLElement
    expect(messageContainer).toHaveClass('own')
  })

  it('applies correct CSS classes for other user message', () => {
    const { container } = render(
      <MessageBubble message={mockMessage} isOwn={false} />
    )

    const messageContainer = container.firstChild as HTMLElement
    expect(messageContainer).toHaveClass('other')
  })

  it('renders avatar with correct dimensions', () => {
    render(<MessageBubble message={mockMessage} isOwn={false} />)

    const avatar = screen.getByAltText('User avatar')
    expect(avatar).toHaveAttribute('width', '32')
    expect(avatar).toHaveAttribute('height', '32')
  })

  it('handles different sender usernames', () => {
    const messageWithDifferentSender = {
      ...mockMessage,
      sender: {
        username: 'alice123',
        name: 'Alice Smith',
        image: '/alice.jpg',
      },
    }

    render(<MessageBubble message={messageWithDifferentSender} isOwn={false} />)

    expect(screen.getByAltText('User avatar')).toHaveAttribute(
      'src',
      '/alice.jpg'
    )
  })

  it('handles message without sender name', () => {
    const messageWithoutName = {
      ...mockMessage,
      sender: {
        username: 'user123',
        image: '/user.jpg',
      },
    }

    render(<MessageBubble message={messageWithoutName} isOwn={false} />)

    expect(screen.getByAltText('User avatar')).toBeInTheDocument()
    expect(screen.getByText('Hello, how are you?')).toBeInTheDocument()
  })
})
