import React, { useEffect, useRef, useState } from 'react'
import styles from '@/styles/AddPost.module.css'

interface CameraCaptureProps {
  onCapture: (file: File) => void
  onClose: () => void
}

type FilterName =
  | 'none'
  | 'grayscale(100%)'
  | 'sanfrancisco'
  | 'tokyo'
  | 'london'
  | 'nyc'

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
  const [filter, setFilter] = useState<FilterName>('none')

  useEffect(() => {
    const initCamera = async () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        })
        streamRef.current = stream
        if (videoRef.current) {
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

  const handleCapture = () => {
    const video = videoRef.current
    if (!video) return

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Базовый кадр
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // === ФИЛЬТРЫ ===
    if (filter === 'grayscale(100%)') {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imgData.data
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
        data[i] = data[i + 1] = data[i + 2] = avg
      }
      ctx.putImageData(imgData, 0, 0)
    }

    if (filter === 'tokyo') {
      // Синий оверлей
      ctx.fillStyle = 'rgba(0, 80, 180, 0.2)'
      ctx.globalCompositeOperation = 'overlay'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Виньетка
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.3,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.7
      )
      gradient.addColorStop(0, 'rgba(0,0,0,0)')
      gradient.addColorStop(1, 'rgba(0,0,0,0.5)')
      ctx.fillStyle = gradient
      ctx.globalCompositeOperation = 'multiply'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    if (filter === 'london') {
      // Лёгкая виньетка
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.5,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.8
      )
      gradient.addColorStop(0, 'rgba(0,0,0,0)')
      gradient.addColorStop(1, 'rgba(0,0,0,0.25)')
      ctx.fillStyle = gradient
      ctx.globalCompositeOperation = 'multiply'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    if (filter === 'nyc') {
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.4,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.8
      )
      gradient.addColorStop(0, 'rgba(0,0,0,0)')
      gradient.addColorStop(1, 'rgba(0,0,0,0.7)')
      ctx.fillStyle = gradient
      ctx.globalCompositeOperation = 'multiply'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Сброс
    ctx.globalCompositeOperation = 'source-over'

    // Сохраняем
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' })
        onCapture(file)
      }
    }, 'image/jpeg')
  }

  const filterData = filtersWithOverlay[filter]

  return (
    <div>
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
        style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 10 }}
      >
        {(Object.keys(filtersWithOverlay) as FilterName[]).map((f) => (
          <button
            type="button"
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 12px',
              borderRadius: 4,
              border: filter === f ? '2px solid #007aff' : '1px solid #ccc',
              background: filter === f ? '#e6f0ff' : 'white',
              cursor: 'pointer',
              minWidth: 90,
              fontSize: 14,
            }}
          >
            {f === 'none'
              ? 'None'
              : f === 'grayscale(100%)'
              ? 'Paris'
              : f === 'sanfrancisco'
              ? 'San Francisco'
              : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <div className={styles.Btns}>
        <button
          type="button"
          onClick={handleCapture}
          className={styles.takePictureBtn}
          style={{ marginTop: 12 }}
        >
          📸 Capture
        </button>
        <button
          type="button"
          onClick={() => onClose && onClose()}
          className={styles.closeBtn}
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default CameraCapture
