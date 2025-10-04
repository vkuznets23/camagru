'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import styles from '@/styles/AddPost.module.css'
import Image from 'next/image'
import Button from '../Button'
import CameraModal from './CameraModal'

function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    const reader = new FileReader()

    reader.onload = (e) => {
      if (!e.target?.result) return reject('No file result')
      img.src = e.target.result as string
    }

    img.onload = () => {
      const canvas = document.createElement('canvas')
      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height
          height = maxHeight
        }
      }

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) return reject('No canvas context')

      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject('Canvas is empty')
          resolve(new File([blob], file.name, { type: file.type }))
        },
        file.type,
        0.9
      )
    }

    reader.readAsDataURL(file)
  })
}

export default function AddPost({ onPostAdded }: { onPostAdded?: () => void }) {
  const { data: session } = useSession()
  const [content, setContent] = useState('')
  const [image, setImage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [showCameraModal, setShowCameraModal] = useState(false)

  const handleCameraCapture = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append(
      'upload_preset',
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOADPRESET!
    )

    setUploading(true)

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      const data = await res.json()
      if (data.secure_url) {
        setImage(data.secure_url)
      }
    } catch (err) {
      console.error('Upload failed', err)
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session?.user?.id) {
      alert('You must be logged in')
      return
    }

    if (!image) {
      alert('Please upload an image')
      return
    }

    if (content.trim().length > 2200) {
      alert('Caption is too long')
      return
    }

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: content.trim() || undefined,
        image,
        userId: session.user.id,
      }),
    })

    if (res.ok) {
      setContent('')
      setImage('')
      if (onPostAdded) onPostAdded()
    } else {
      alert('Failed to add post')
    }
  }

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [content])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      const resizedFile = await resizeImage(file, 1080, 1080)

      const formData = new FormData()
      formData.append('file', resizedFile)
      formData.append(
        'upload_preset',
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOADPRESET!
      )
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      const data = await res.json()
      if (data.secure_url) {
        setImage(data.secure_url)
      }
    } catch (err) {
      console.error('Upload failed', err)
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.pageContainer}>
        <div className={styles.form}>
          <div className={styles.imageContainer}>
            {image && (
              <div className={styles.image}>
                <Image
                  src={image}
                  fill
                  alt="Preview of the uploaded image"
                  style={{ objectFit: 'contain' }}
                />
              </div>
            )}

            <label htmlFor="fileUpload" className={styles.uploadButton}>
              {uploading ? 'Uploading...' : 'Upload Image'}
            </label>
            <input
              id="fileUpload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={styles.visuallyHidden}
              aria-label="Upload image file"
            />
            <button
              type="button"
              onClick={() => setShowCameraModal(true)}
              aria-label="Open camera"
              className={styles.uploadButton}
            >
              Open Camera
            </button>
          </div>
          {showCameraModal && (
            <CameraModal
              onClose={() => setShowCameraModal(false)}
              onCapture={(file) => {
                setShowCameraModal(false)
                handleCameraCapture(file)
              }}
            />
          )}
          <div className={styles.textareaContainer}>
            <textarea
              ref={textareaRef}
              aria-describedby="caption-desc"
              aria-label="Post caption"
              placeholder="Add a caption..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={2200}
              rows={3}
              className={styles.textarea}
            />
            <div id="caption-desc" className={styles.charCount}>
              {content.length}/2200
            </div>
          </div>
        </div>
        <Button
          id="addPost"
          testid="addPost"
          text="Post"
          disabled={!image || uploading}
          aria-disabled={!image || uploading}
        />
      </div>
    </form>
  )
}
