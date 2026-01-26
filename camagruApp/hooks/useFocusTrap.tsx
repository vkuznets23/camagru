import { useEffect } from 'react'

/**
 * useFocusTrap
 * Keeps focus within a container element (modal/dialog) and allows Escape to close.
 *
 * @param containerRef - ref of the element to trap focus in
 * @param onClose - callback when Escape is pressed
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return

      const focusableElements = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetWidth > 0 || el.offsetHeight > 0)

      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }

      if (e.key === 'Tab') {
        if (focusableElements.length === 0) return

        const first = focusableElements[0]
        const last = focusableElements[focusableElements.length - 1]
        const active = document.activeElement as HTMLElement
        const isShift = e.shiftKey

        if (isShift && active === first) {
          e.preventDefault()
          last.focus()
        } else if (!isShift && active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // Focus first element on mount
    if (containerRef.current) {
      const firstElement = containerRef.current.querySelector<HTMLElement>(
        'button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      firstElement?.focus()
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [containerRef, onClose])
}
