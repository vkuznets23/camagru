import React, { useEffect, useRef, useState } from 'react'
import styles from '@/styles/AddPost.module.css'
import { applyCanvasFilter, FilterName } from './ApplyCanvasFilters'
import { filtersWithOverlay } from './Filters'
import { FilterSelector } from './FilterSelector'

interface CameraCaptureProps {
  onCapture: (file: File) => void
  onClose: () => void
}

const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const [filter, setFilter] = useState<FilterName>('none')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 500)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const initCamera = async () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }

      try {
        // get camera access
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        })
        // keep media stream in the ref
        streamRef.current = stream
        if (videoRef.current) {
          // render stream to video
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.error('Error accessing camera:', err)
      }
    }

    initCamera()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (videoRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        videoRef.current.srcObject = null
      }
    }
  }, [])

  // Focus trap for keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === 'Tab') {
        if (!modalRef.current) return

        const focusableElements =
          modalRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
          )
        const focusable = Array.from(focusableElements).filter(
          (el) => el.offsetWidth > 0 || el.offsetHeight > 0,
        )
        if (focusable.length === 0) return

        const firstElement = focusable[0]
        const lastElement = focusable[focusable.length - 1]
        const isShift = e.shiftKey
        const active = document.activeElement

        if (isShift && active === firstElement) {
          e.preventDefault()
          lastElement.focus()
        } else if (!isShift && active === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // Focus first element when modal opens
    if (modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      const focusable = Array.from(focusableElements).filter(
        (el) => el.offsetWidth > 0 || el.offsetHeight > 0,
      )
      if (focusable.length > 0) {
        focusable[0].focus()
      }
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const handleCapture = () => {
    const video = videoRef.current
    if (!video) return

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    applyCanvasFilter(ctx, filter, canvas.width, canvas.height)

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' })
        onCapture(file)
      }
    }, 'image/jpeg')
  }

  const filterData = filtersWithOverlay[filter]

  return (
    <div ref={modalRef}>
      <div className={styles.videoDiv}>
        <button
          type="button"
          onClick={() => onClose && onClose()}
          aria-label="Close camera"
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            fontSize: 20,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)'
          }}
        >
          ✕
        </button>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            filter: filterData?.cssFilter || 'none',
            display: 'block',
            borderRadius: 8,
          }}
        />
        {filterData?.overlay}
      </div>

      <FilterSelector
        filters={filtersWithOverlay}
        current={filter}
        onSelect={setFilter}
        isMobile={isMobile}
      />

      <div className={styles.Btns}>
        <button
          type="button"
          onClick={handleCapture}
          className={styles.takePictureBtn}
          style={{ marginTop: 12, width: '100%' }}
          aria-label="Take picture"
        >
          Capture
        </button>
      </div>
    </div>
  )
}

export default CameraCapture
