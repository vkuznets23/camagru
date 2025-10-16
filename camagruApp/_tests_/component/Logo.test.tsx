import { render, screen } from '@testing-library/react'
import Logo from '@/components/Logo'
import '@testing-library/jest-dom'

// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({
    src,
    alt,
    width,
    height,
    className,
    priority,
  }: {
    src: string
    alt: string
    width: number
    height: number
    className?: string
    priority?: boolean
  }) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        data-priority={priority}
      />
    )
  }
})

describe('Logo', () => {
  it('renders dark mode logo by default', () => {
    render(<Logo />)

    const logo = screen.getByAltText('camagru logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/assets/LogoCamagru2.svg')
  })

  it('renders light mode logo when mode is light', () => {
    render(<Logo mode="light" />)

    const logo = screen.getByAltText('camagru logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/assets/LogoCamagru.svg')
  })

  it('renders dark mode logo when mode is dark', () => {
    render(<Logo mode="dark" />)

    const logo = screen.getByAltText('camagru logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/assets/LogoCamagru2.svg')
  })

  it('uses default dimensions', () => {
    render(<Logo />)

    const logo = screen.getByAltText('camagru logo')
    expect(logo).toHaveAttribute('width', '172')
    expect(logo).toHaveAttribute('height', '48')
  })

  it('uses custom dimensions', () => {
    render(<Logo width={200} height={60} />)

    const logo = screen.getByAltText('camagru logo')
    expect(logo).toHaveAttribute('width', '200')
    expect(logo).toHaveAttribute('height', '60')
  })

  it('applies custom className', () => {
    render(<Logo className="custom-logo-class" />)

    const logo = screen.getByAltText('camagru logo')
    expect(logo).toHaveClass('custom-logo-class')
  })

  it('does not have className when not provided', () => {
    render(<Logo />)

    const logo = screen.getByAltText('camagru logo')
    expect(logo).not.toHaveClass()
  })

  it('has priority attribute set to true', () => {
    render(<Logo />)

    const logo = screen.getByAltText('camagru logo')
    expect(logo).toHaveAttribute('data-priority', 'true')
  })

  it('renders light logo with all props', () => {
    render(
      <Logo mode="light" width={150} height={40} className="header-logo" />
    )

    const logo = screen.getByAltText('camagru logo')
    expect(logo).toHaveAttribute('src', '/assets/LogoCamagru.svg')
    expect(logo).toHaveAttribute('width', '150')
    expect(logo).toHaveAttribute('height', '40')
    expect(logo).toHaveClass('header-logo')
    expect(logo).toHaveAttribute('data-priority', 'true')
  })

  it('renders dark logo with all props', () => {
    render(<Logo mode="dark" width={180} height={50} className="footer-logo" />)

    const logo = screen.getByAltText('camagru logo')
    expect(logo).toHaveAttribute('src', '/assets/LogoCamagru2.svg')
    expect(logo).toHaveAttribute('width', '180')
    expect(logo).toHaveAttribute('height', '50')
    expect(logo).toHaveClass('footer-logo')
    expect(logo).toHaveAttribute('data-priority', 'true')
  })

  it('handles zero dimensions', () => {
    render(<Logo width={0} height={0} />)

    const logo = screen.getByAltText('camagru logo')
    expect(logo).toHaveAttribute('width', '0')
    expect(logo).toHaveAttribute('height', '0')
  })

  it('handles very large dimensions', () => {
    render(<Logo width={1000} height={500} />)

    const logo = screen.getByAltText('camagru logo')
    expect(logo).toHaveAttribute('width', '1000')
    expect(logo).toHaveAttribute('height', '500')
  })

  it('handles undefined mode (defaults to dark)', () => {
    render(<Logo mode={undefined} />)

    const logo = screen.getByAltText('camagru logo')
    expect(logo).toHaveAttribute('src', '/assets/LogoCamagru2.svg')
  })

  it('handles null mode (defaults to dark)', () => {
    render(<Logo mode={null as unknown as 'dark' | 'light'} />)

    const logo = screen.getByAltText('camagru logo')
    expect(logo).toHaveAttribute('src', '/assets/LogoCamagru2.svg')
  })

  it('handles empty string mode (defaults to dark)', () => {
    render(<Logo mode={'' as unknown as 'dark' | 'light'} />)

    const logo = screen.getByAltText('camagru logo')
    expect(logo).toHaveAttribute('src', '/assets/LogoCamagru2.svg')
  })

  it('handles invalid mode (defaults to dark)', () => {
    render(<Logo mode={'invalid' as unknown as 'dark' | 'light'} />)

    const logo = screen.getByAltText('camagru logo')
    expect(logo).toHaveAttribute('src', '/assets/LogoCamagru2.svg')
  })

  it('maintains consistent alt text across modes', () => {
    const { rerender } = render(<Logo mode="light" />)
    expect(screen.getByAltText('camagru logo')).toBeInTheDocument()

    rerender(<Logo mode="dark" />)
    expect(screen.getByAltText('camagru logo')).toBeInTheDocument()
  })

  it('maintains priority attribute across different props', () => {
    const { rerender } = render(<Logo mode="light" />)
    expect(screen.getByAltText('camagru logo')).toHaveAttribute(
      'data-priority',
      'true'
    )

    rerender(<Logo mode="dark" width={100} height={30} className="test" />)
    expect(screen.getByAltText('camagru logo')).toHaveAttribute(
      'data-priority',
      'true'
    )
  })
})
