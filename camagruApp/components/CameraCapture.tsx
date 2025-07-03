import React, { useEffect, useRef } from 'react'

interface CameraCaptureProps {
  onCapture: (file: File) => void
  onStop?: () => void
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

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
      console.log('Camera capture unmounting...')
      const stream = streamRef.current
      if (!stream) return

      const tracks = stream.getTracks()
      tracks.forEach((track) => {
        track.stop()
      })

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

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' })
        onCapture(file)
      }
    }, 'image/jpeg')
  }

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline muted width={400} />
      <br />
      <button type="button" onClick={handleCapture}>
        📸 Capture
      </button>
    </div>
  )
}

export default CameraCapture
