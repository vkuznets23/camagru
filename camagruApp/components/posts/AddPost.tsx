'use client'

import { useEffect, useRef, useState } from 'react'
import CameraCapture from '@/components/CameraCapture'
import { useSession } from 'next-auth/react'
import styles from '@/styles/AddPost.module.css'
import Image from 'next/image'
import Button from '../Button'

export default function AddPost({ onPostAdded }: { onPostAdded?: () => void }) {
  const { data: session } = useSession()
  const [content, setContent] = useState('')
  const [image, setImage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [showCamera, setShowCamera] = useState(false)

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
        setShowCamera(false)
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
                  alt="Preview"
                  style={{ objectFit: 'contain' }}
                />
              </div>
            )}
            {uploading && <p>Uploading...</p>}
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <div>
              <button type="button" onClick={() => setShowCamera(!showCamera)}>
                {showCamera ? 'Close Camera' : 'Open Camera'}
              </button>
              {showCamera && <CameraCapture onCapture={handleCameraCapture} />}
            </div>
          </div>
          <div className={styles.textareaContainer}>
            <textarea
              ref={textareaRef}
              placeholder="Add a caption..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={2200}
              rows={3}
              className={styles.textarea}
            />
            <div className={styles.charCount}>{content.length}/2200</div>
          </div>
        </div>
        <Button
          id="addPost"
          testid="addPost"
          text="Post"
          disabled={!image || uploading}
        />
      </div>
    </form>
  )
}
