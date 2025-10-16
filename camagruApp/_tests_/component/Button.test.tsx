import { render, screen, fireEvent } from '@testing-library/react'
import Button from '@/components/Button'
import '@testing-library/jest-dom'

describe('Button', () => {
  const defaultProps = {
    id: 'test-button',
    testid: 'test-button',
    text: 'Click me',
  }

  it('renders button with correct text', () => {
    render(<Button {...defaultProps} />)

    expect(screen.getByText('Click me')).toBeInTheDocument()
    expect(screen.getByTestId('test-button')).toBeInTheDocument()
  })

  it('renders button with correct id', () => {
    render(<Button {...defaultProps} />)

    expect(screen.getByTestId('test-button')).toHaveAttribute(
      'id',
      'test-button'
    )
  })

  it('renders button with correct type', () => {
    render(<Button {...defaultProps} />)

    expect(screen.getByTestId('test-button')).toHaveAttribute('type', 'submit')
  })

  it('applies correct CSS class', () => {
    render(<Button {...defaultProps} />)

    expect(screen.getByTestId('test-button')).toHaveClass('button')
  })

  it('is enabled by default', () => {
    render(<Button {...defaultProps} />)

    expect(screen.getByTestId('test-button')).not.toBeDisabled()
  })

  it('can be disabled', () => {
    render(<Button {...defaultProps} disabled={true} />)

    expect(screen.getByTestId('test-button')).toBeDisabled()
  })

  it('has correct aria-label when provided', () => {
    render(<Button {...defaultProps} aria-label="Custom label" />)

    expect(screen.getByTestId('test-button')).toHaveAttribute(
      'aria-label',
      'Custom label'
    )
  })

  it('uses text as aria-label when aria-label is not provided', () => {
    render(<Button {...defaultProps} />)

    expect(screen.getByTestId('test-button')).toHaveAttribute(
      'aria-label',
      'Click me'
    )
  })

  it('has correct aria-disabled when provided', () => {
    render(<Button {...defaultProps} aria-disabled={true} />)

    expect(screen.getByTestId('test-button')).toHaveAttribute(
      'aria-disabled',
      'true'
    )
  })

  it('does not have aria-disabled when not provided', () => {
    render(<Button {...defaultProps} />)

    expect(screen.getByTestId('test-button')).not.toHaveAttribute(
      'aria-disabled'
    )
  })

  it('can be clicked when enabled', () => {
    render(<Button {...defaultProps} />)

    const button = screen.getByTestId('test-button')
    expect(button).not.toBeDisabled()

    // Button can be clicked (no error should occur)
    fireEvent.click(button)
  })

  it('cannot be clicked when disabled', () => {
    render(<Button {...defaultProps} disabled={true} />)

    const button = screen.getByTestId('test-button')
    expect(button).toBeDisabled()

    // Disabled button should not respond to clicks
    fireEvent.click(button)
    // No error should occur, but button should remain disabled
    expect(button).toBeDisabled()
  })

  it('renders with different text', () => {
    render(<Button {...defaultProps} text="Submit Form" />)

    expect(screen.getByText('Submit Form')).toBeInTheDocument()
    expect(screen.getByTestId('test-button')).toHaveAttribute(
      'aria-label',
      'Submit Form'
    )
  })

  it('renders with different testid', () => {
    render(<Button {...defaultProps} testid="submit-button" />)

    expect(screen.getByTestId('submit-button')).toBeInTheDocument()
    expect(screen.queryByTestId('test-button')).not.toBeInTheDocument()
  })

  it('renders with different id', () => {
    render(<Button {...defaultProps} id="submit-form-button" />)

    expect(screen.getByTestId('test-button')).toHaveAttribute(
      'id',
      'submit-form-button'
    )
  })

  it('handles special characters in text', () => {
    render(<Button {...defaultProps} text="Submit & Save" />)

    expect(screen.getByText('Submit & Save')).toBeInTheDocument()
    expect(screen.getByTestId('test-button')).toHaveAttribute(
      'aria-label',
      'Submit & Save'
    )
  })

  it('handles empty text', () => {
    render(<Button {...defaultProps} text="" />)

    expect(screen.getByTestId('test-button')).toHaveTextContent('')
    expect(screen.getByTestId('test-button')).toHaveAttribute('aria-label', '')
  })

  it('handles long text', () => {
    const longText =
      'This is a very long button text that should be displayed properly'
    render(<Button {...defaultProps} text={longText} />)

    expect(screen.getByText(longText)).toBeInTheDocument()
    expect(screen.getByTestId('test-button')).toHaveAttribute(
      'aria-label',
      longText
    )
  })

  it('handles emoji in text', () => {
    render(<Button {...defaultProps} text="Save 💾" />)

    expect(screen.getByText('Save 💾')).toBeInTheDocument()
    expect(screen.getByTestId('test-button')).toHaveAttribute(
      'aria-label',
      'Save 💾'
    )
  })

  it('maintains all props when disabled', () => {
    render(
      <Button
        {...defaultProps}
        disabled={true}
        aria-label="Disabled button"
        aria-disabled={true}
      />
    )

    const button = screen.getByTestId('test-button')
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-label', 'Disabled button')
    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(button).toHaveAttribute('type', 'submit')
    expect(button).toHaveClass('button')
  })
})
