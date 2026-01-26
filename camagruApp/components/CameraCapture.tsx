import React, { useEffect, useRef, useState } from 'react'
import styles from '@/styles/AddPost.module.css'
import { applyCanvasFilter, FilterName } from './ApplyCanvasFilters'

interface CameraCaptureProps {
  onCapture: (file: File) => void
  onClose: () => void
}

const filtersWithOverlay: Record<
  FilterName,
  { cssFilter: string; overlay?: React.ReactNode }
> = {
  none: { cssFilter: 'none' },
  'grayscale(100%)': { cssFilter: 'grayscale(100%)' }, // Paris

  sanfrancisco: {
    cssFilter: 'brightness(110%) contrast(110%) sepia(0.3)',
    overlay: (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          background: 'rgba(255, 223, 186, 0.15)',
          mixBlendMode: 'screen',
          borderRadius: 'inherit',
        }}
      />
    ),
  },
  tokyo: {
    cssFilter: 'brightness(105%) contrast(120%) saturate(120%)',
    overlay: (
      <>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            background: 'rgba(0, 80, 180, 0.2)',
            mixBlendMode: 'overlay',
            borderRadius: 'inherit',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(0,0,0,0.5) 100%)',
            mixBlendMode: 'multiply',
            borderRadius: 'inherit',
          }}
        />
      </>
    ),
  },
  london: {
    cssFilter: 'brightness(120%) contrast(90%) blur(0.3px)',
    overlay: (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.25) 100%)',
          mixBlendMode: 'multiply',
          borderRadius: 'inherit',
        }}
      />
    ),
  },
  nyc: {
    cssFilter: 'contrast(120%) brightness(90%) saturate(80%)',
    overlay: (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          borderRadius: 'inherit',
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)',
          mixBlendMode: 'multiply',
        }}
      />
    ),
  },
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

    // Save
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
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 640,
          margin: 'auto',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
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
      <div
        style={{
          marginTop: 10,
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
        }}
      >
        {(Object.keys(filtersWithOverlay) as FilterName[]).map((f) => (
          <button
            type="button"
            key={f}
            onClick={() => setFilter(f)}
            aria-label={`Apply ${
              f === 'none'
                ? 'no filter'
                : f === 'grayscale(100%)'
                  ? 'Paris filter'
                  : f === 'sanfrancisco'
                    ? 'San Francisco filter'
                    : f
            } filter`}
            aria-pressed={filter === f}
            style={{
              padding: '6px 12px',
              borderRadius: 4,
              border: filter === f ? '2px solid #007aff' : '1px solid #ccc',
              background: filter === f ? '#e6f0ff' : 'white',
              cursor: 'pointer',
              flex: isMobile ? '1 1 calc(50% - 5px)' : '1',
              minWidth: isMobile ? 'calc(50% - 5px)' : 'auto',
              fontSize: 14,
            }}
          >
            {f === 'none'
              ? 'None'
              : f === 'grayscale(100%)'
                ? 'Paris'
                : f === 'sanfrancisco'
                  ? 'SanFr'
                  : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
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
