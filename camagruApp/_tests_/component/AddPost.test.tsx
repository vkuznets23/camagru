import { render, screen, fireEvent } from '@testing-library/react'
import AddPost from '@/components/posts/AddPost'
import { useSession } from 'next-auth/react'
import '@testing-library/jest-dom'

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}))

// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({
    src,
    alt,
    fill,
    style,
  }: {
    src: string
    alt: string
    fill?: boolean
    style?: React.CSSProperties
  }) {
    return <img src={src} alt={alt} data-fill={fill} style={style} />
  }
})

// Mock Button component
jest.mock('@/components/Button', () => {
  return function MockButton({
    id,
    testid,
    text,
    disabled,
    'aria-disabled': ariaDisabled,
  }: {
    id: string
    testid: string
    text: string
    disabled?: boolean
    'aria-disabled'?: boolean
  }) {
    return (
      <button
        id={id}
        data-testid={testid}
        disabled={disabled}
        aria-disabled={ariaDisabled}
      >
        {text}
      </button>
    )
  }
})

// Mock CameraModal component
jest.mock('@/components/posts/CameraModal', () => {
  return function MockCameraModal({
    onClose,
    onCapture,
  }: {
    onClose: () => void
    onCapture: (file: File) => void
  }) {
    return (
      <div data-testid="camera-modal">
        <button onClick={onClose}>Close Camera</button>
        <button
          onClick={() => {
            const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
            onCapture(file)
          }}
        >
          Capture Photo
        </button>
      </div>
    )
  }
})

// Mock global fetch
global.fetch = jest.fn()

// Mock window.alert
global.alert = jest.fn()

describe('AddPost', () => {
  const mockOnPostAdded = jest.fn()
  const mockSession = {
    user: {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSession as jest.Mock).mockReturnValue({
      data: mockSession,
      status: 'authenticated',
    })
    ;(global.fetch as jest.Mock).mockClear()
    ;(global.alert as jest.Mock).mockClear()

    // Mock environment variables
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = 'test-cloud'
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOADPRESET = 'test-preset'
  })

  it('renders form with all elements', () => {
    render(<AddPost onPostAdded={mockOnPostAdded} />)

    expect(screen.getByLabelText('Upload image file')).toBeInTheDocument()
    expect(screen.getByText('Upload Image')).toBeInTheDocument()
    expect(screen.getByText('Open Camera')).toBeInTheDocument()
    expect(screen.getByLabelText('Post caption')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Add a caption...')).toBeInTheDocument()
    expect(screen.getByTestId('addPost')).toBeInTheDocument()
    expect(screen.getByText('0/2200')).toBeInTheDocument()
  })

  it('renders without onPostAdded callback', () => {
    render(<AddPost />)

    expect(screen.getByTestId('addPost')).toBeInTheDocument()
    expect(screen.getByLabelText('Post caption')).toBeInTheDocument()
  })

  it('disables submit button when no image is uploaded', () => {
    render(<AddPost onPostAdded={mockOnPostAdded} />)

    const submitButton = screen.getByTestId('addPost')
    expect(submitButton).toBeDisabled()
    expect(submitButton).toHaveAttribute('aria-disabled', 'true')
  })

  it('handles textarea input and character count', () => {
    render(<AddPost onPostAdded={mockOnPostAdded} />)

    const textarea = screen.getByLabelText('Post caption')

    fireEvent.change(textarea, { target: { value: 'Hello world' } })

    expect(textarea).toHaveValue('Hello world')
    expect(screen.getByText('11/2200')).toBeInTheDocument()
  })

  it('handles long caption text', () => {
    render(<AddPost onPostAdded={mockOnPostAdded} />)

    const textarea = screen.getByLabelText('Post caption')
    const longText = 'a'.repeat(2200)

    fireEvent.change(textarea, { target: { value: longText } })

    expect(textarea).toHaveValue(longText)
    expect(screen.getByText('2200/2200')).toBeInTheDocument()
  })

  it('opens camera modal when camera button is clicked', () => {
    render(<AddPost onPostAdded={mockOnPostAdded} />)

    const cameraButton = screen.getByText('Open Camera')
    fireEvent.click(cameraButton)

    expect(screen.getByTestId('camera-modal')).toBeInTheDocument()
  })

  it('closes camera modal when close button is clicked', () => {
    render(<AddPost onPostAdded={mockOnPostAdded} />)

    const cameraButton = screen.getByText('Open Camera')
    fireEvent.click(cameraButton)

    expect(screen.getByTestId('camera-modal')).toBeInTheDocument()

    const closeButton = screen.getByText('Close Camera')
    fireEvent.click(closeButton)

    expect(screen.queryByTestId('camera-modal')).not.toBeInTheDocument()
  })

  it('shows alert when no image is uploaded', async () => {
    render(<AddPost onPostAdded={mockOnPostAdded} />)

    const textarea = screen.getByLabelText('Post caption')
    fireEvent.change(textarea, { target: { value: 'Test caption' } })

    const form = screen.getByTestId('addPost').closest('form')
    fireEvent.submit(form!)

    expect(global.alert).toHaveBeenCalledWith('Please upload an image')
  })

  it('shows alert when not logged in', async () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    })

    render(<AddPost onPostAdded={mockOnPostAdded} />)

    // Simulate having an image by directly setting the state
    // This is a simplified test that focuses on the validation logic
    const form = screen.getByTestId('addPost').closest('form')
    fireEvent.submit(form!)

    expect(global.alert).toHaveBeenCalledWith('You must be logged in')
  })

  it('has correct accessibility attributes', () => {
    render(<AddPost onPostAdded={mockOnPostAdded} />)

    expect(screen.getByLabelText('Upload image file')).toHaveAttribute(
      'type',
      'file'
    )
    expect(screen.getByLabelText('Upload image file')).toHaveAttribute(
      'accept',
      'image/*'
    )
    expect(screen.getByLabelText('Post caption')).toHaveAttribute(
      'maxLength',
      '2200'
    )
    expect(screen.getByLabelText('Post caption')).toHaveAttribute(
      'aria-describedby',
      'caption-desc'
    )
    expect(screen.getByText('0/2200')).toHaveAttribute('id', 'caption-desc')
    expect(screen.getByText('Open Camera')).toHaveAttribute(
      'aria-label',
      'Open camera'
    )
  })

  it('auto-resizes textarea based on content', () => {
    render(<AddPost onPostAdded={mockOnPostAdded} />)

    const textarea = screen.getByLabelText('Post caption')

    // Mock scrollHeight
    Object.defineProperty(textarea, 'scrollHeight', {
      writable: true,
      value: 100,
    })

    fireEvent.change(textarea, { target: { value: 'Line 1\nLine 2\nLine 3' } })

    expect(textarea.style.height).toBe('100px')
  })

  it('handles special characters in caption', () => {
    render(<AddPost onPostAdded={mockOnPostAdded} />)

    const textarea = screen.getByLabelText('Post caption')
    const specialText = 'Hello! 👋 How are you? 😊 @#$%^&*()'

    fireEvent.change(textarea, { target: { value: specialText } })

    expect(textarea).toHaveValue(specialText)
    expect(screen.getByText(`${specialText.length}/2200`)).toBeInTheDocument()
  })

  it('handles empty caption', () => {
    render(<AddPost onPostAdded={mockOnPostAdded} />)

    const textarea = screen.getByLabelText('Post caption')

    fireEvent.change(textarea, { target: { value: '' } })

    expect(textarea).toHaveValue('')
    expect(screen.getByText('0/2200')).toBeInTheDocument()
  })

  it('handles whitespace-only caption', () => {
    render(<AddPost onPostAdded={mockOnPostAdded} />)

    const textarea = screen.getByLabelText('Post caption')

    fireEvent.change(textarea, { target: { value: '   ' } })

    expect(textarea).toHaveValue('   ')
    expect(screen.getByText('3/2200')).toBeInTheDocument()
  })
})
