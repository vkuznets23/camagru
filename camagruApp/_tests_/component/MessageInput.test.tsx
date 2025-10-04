import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import MessageInput from '@/components/chat/MessageInput'
import '@testing-library/jest-dom'

// Mock react-icons
jest.mock('react-icons/ri', () => ({
  RiSendPlaneFill: () => <span data-testid="send-icon">Send</span>,
}))

describe('MessageInput', () => {
  const mockOnSendMessage = jest.fn()
  const mockOnTyping = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders textarea and send button', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} />)

    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /send message/i })
    ).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument()
  })

  it('renders with custom placeholder', () => {
    render(
      <MessageInput
        onSendMessage={mockOnSendMessage}
        placeholder="Custom placeholder"
      />
    )

    expect(
      screen.getByPlaceholderText('Custom placeholder')
    ).toBeInTheDocument()
  })

  it('disables send button when message is empty', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} />)

    const sendButton = screen.getByRole('button', { name: /send message/i })
    expect(sendButton).toBeDisabled()
  })

  it('enables send button when message has content', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} />)

    const textarea = screen.getByRole('textbox')
    const sendButton = screen.getByRole('button', { name: /send message/i })

    fireEvent.change(textarea, { target: { value: 'Hello world' } })

    expect(sendButton).not.toBeDisabled()
  })

  it('disables send button when disabled prop is true', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} disabled={true} />)

    const textarea = screen.getByRole('textbox')
    const sendButton = screen.getByRole('button', { name: /send message/i })

    fireEvent.change(textarea, { target: { value: 'Hello world' } })

    expect(sendButton).toBeDisabled()
    expect(textarea).toBeDisabled()
  })

  it('sends message when send button is clicked', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} />)

    const textarea = screen.getByRole('textbox')
    const sendButton = screen.getByRole('button', { name: /send message/i })

    fireEvent.change(textarea, { target: { value: 'Hello world' } })
    fireEvent.click(sendButton)

    expect(mockOnSendMessage).toHaveBeenCalledWith('Hello world')
    expect(textarea).toHaveValue('')
  })

  it('sends message on Enter key press', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} />)

    const textarea = screen.getByRole('textbox')

    fireEvent.change(textarea, { target: { value: 'Hello world' } })
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false })

    expect(mockOnSendMessage).toHaveBeenCalledWith('Hello world')
    expect(textarea).toHaveValue('')
  })

  it('does not send message on Shift+Enter', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} />)

    const textarea = screen.getByRole('textbox')

    fireEvent.change(textarea, { target: { value: 'Hello world' } })
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true })

    expect(mockOnSendMessage).not.toHaveBeenCalled()
    expect(textarea).toHaveValue('Hello world')
  })

  it('trims whitespace from message before sending', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} />)

    const textarea = screen.getByRole('textbox')
    const sendButton = screen.getByRole('button', { name: /send message/i })

    fireEvent.change(textarea, { target: { value: '  Hello world  ' } })
    fireEvent.click(sendButton)

    expect(mockOnSendMessage).toHaveBeenCalledWith('Hello world')
  })

  it('does not send empty or whitespace-only messages', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} />)

    const textarea = screen.getByRole('textbox')
    const sendButton = screen.getByRole('button', { name: /send message/i })

    // Test empty message
    fireEvent.change(textarea, { target: { value: '' } })
    fireEvent.click(sendButton)
    expect(mockOnSendMessage).not.toHaveBeenCalled()

    // Test whitespace-only message
    fireEvent.change(textarea, { target: { value: '   ' } })
    fireEvent.click(sendButton)
    expect(mockOnSendMessage).not.toHaveBeenCalled()
  })

  it('respects maxLength prop', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} maxLength={10} />)

    const textarea = screen.getByRole('textbox')

    fireEvent.change(textarea, { target: { value: '1234567890' } })
    expect(textarea).toHaveValue('1234567890')

    fireEvent.change(textarea, { target: { value: '12345678901' } })
    expect(textarea).toHaveValue('1234567890') // Should be truncated
  })

  it('shows character count when near limit', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} maxLength={100} />)

    const textarea = screen.getByRole('textbox')

    // Should not show count initially
    expect(screen.queryByText(/\d+\/100/)).not.toBeInTheDocument()

    // Should show count when near limit (80% of maxLength = 80)
    fireEvent.change(textarea, { target: { value: 'a'.repeat(81) } })
    expect(screen.getByText('81/100')).toBeInTheDocument()
  })

  it('shows error styling when at character limit', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} maxLength={100} />)

    const textarea = screen.getByRole('textbox')

    fireEvent.change(textarea, { target: { value: 'a'.repeat(100) } })

    const charCount = screen.getByText('100/100')
    expect(charCount).toHaveClass('error')
  })

  it('shows warning styling when near character limit', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} maxLength={100} />)

    const textarea = screen.getByRole('textbox')

    fireEvent.change(textarea, { target: { value: 'a'.repeat(90) } })

    const charCount = screen.getByText('90/100')
    expect(charCount).toHaveClass('warning')
  })

  it('calls onTyping when user starts typing', () => {
    render(
      <MessageInput onSendMessage={mockOnSendMessage} onTyping={mockOnTyping} />
    )

    const textarea = screen.getByRole('textbox')

    fireEvent.change(textarea, { target: { value: 'Hello' } })

    expect(mockOnTyping).toHaveBeenCalledWith(true)
  })

  it('calls onTyping(false) when user stops typing', async () => {
    render(
      <MessageInput onSendMessage={mockOnSendMessage} onTyping={mockOnTyping} />
    )

    const textarea = screen.getByRole('textbox')

    fireEvent.change(textarea, { target: { value: 'Hello' } })
    expect(mockOnTyping).toHaveBeenCalledWith(true)

    // Fast-forward time to trigger typing timeout
    act(() => {
      jest.advanceTimersByTime(1000)
    })

    await waitFor(() => {
      expect(mockOnTyping).toHaveBeenCalledWith(false)
    })
  })

  it('calls onTyping(false) when message is cleared', () => {
    render(
      <MessageInput onSendMessage={mockOnSendMessage} onTyping={mockOnTyping} />
    )

    const textarea = screen.getByRole('textbox')

    fireEvent.change(textarea, { target: { value: 'Hello' } })
    expect(mockOnTyping).toHaveBeenCalledWith(true)

    fireEvent.change(textarea, { target: { value: '' } })
    expect(mockOnTyping).toHaveBeenCalledWith(false)
  })

  it('auto-resizes textarea based on content', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} />)

    const textarea = screen.getByRole('textbox')

    // Mock scrollHeight
    Object.defineProperty(textarea, 'scrollHeight', {
      writable: true,
      value: 100,
    })

    fireEvent.change(textarea, { target: { value: 'Line 1\nLine 2\nLine 3' } })

    expect(textarea.style.height).toBe('100px')
  })

  it('resets textarea height after sending message', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} />)

    const textarea = screen.getByRole('textbox')
    const sendButton = screen.getByRole('button', { name: /send message/i })

    // Set initial height
    textarea.style.height = '100px'

    fireEvent.change(textarea, { target: { value: 'Hello world' } })
    fireEvent.click(sendButton)

    expect(textarea.style.height).toBe('0px')
  })

  it('has correct accessibility attributes', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} />)

    const textarea = screen.getByRole('textbox')
    const sendButton = screen.getByRole('button', { name: /send message/i })

    expect(textarea).toHaveAttribute('aria-label', 'Message input')
    expect(sendButton).toHaveAttribute('aria-label', 'Send message')
  })

  it('has correct accessibility attributes when near character limit', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} maxLength={100} />)

    const textarea = screen.getByRole('textbox')

    fireEvent.change(textarea, { target: { value: 'a'.repeat(81) } })

    expect(textarea).toHaveAttribute('aria-describedby', 'char-count')
    expect(screen.getByText('81/100')).toHaveAttribute('id', 'char-count')
    expect(screen.getByText('81/100')).toHaveAttribute('role', 'status')
    expect(screen.getByText('81/100')).toHaveAttribute('aria-live', 'polite')
  })

  it('handles special characters and emojis', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} />)

    const textarea = screen.getByRole('textbox')
    const sendButton = screen.getByRole('button', { name: /send message/i })

    const specialMessage = 'Hello! 👋 How are you? 😊 @#$%^&*()'

    fireEvent.change(textarea, { target: { value: specialMessage } })
    fireEvent.click(sendButton)

    expect(mockOnSendMessage).toHaveBeenCalledWith(specialMessage)
  })

  it('handles very long messages', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} maxLength={1000} />)

    const textarea = screen.getByRole('textbox')
    const sendButton = screen.getByRole('button', { name: /send message/i })

    const longMessage = 'a'.repeat(1000)

    fireEvent.change(textarea, { target: { value: longMessage } })
    fireEvent.click(sendButton)

    expect(mockOnSendMessage).toHaveBeenCalledWith(longMessage)
  })

  it('does not send message when disabled', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} disabled={true} />)

    const textarea = screen.getByRole('textbox')

    fireEvent.change(textarea, { target: { value: 'Hello world' } })
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false })

    expect(mockOnSendMessage).not.toHaveBeenCalled()
  })
})
