'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from '@/styles/Profile.module.css'
import React from 'react'
import Button from '@/components/Button'
import Modal from '@/components/Modal'
import CameraCapture from '@/components/CameraCapture'

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOADPRESET

export default function SettingsPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [image, setImage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const formValidation = (name: string, bio: string) => {
    const newErrors: { [key: string]: string } = {}
    if (name.length > 30 || name.length < 2) {
      newErrors.name = 'Name should be 2-30 chars'
    }
    if (bio.length > 150) {
      newErrors.bio = 'Bio should be less than 150 char'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '')
      setBio(session.user.bio || '')
      setImage(session.user.image || '')
    }
  }, [session?.user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const isValid = formValidation(name, bio)
    if (!isValid) return

    setLoading(true)

    const res = await fetch('/api/user/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, bio, image }),
    })

    if (res.ok) {
      const data = await res.json()
      setName(data?.user?.name ?? '')
      setBio(data?.user?.bio ?? '')
      setImage(data?.user?.image ?? '')
      await update()
      //   router.refresh()
      router.push(`/user/${session?.user?.id}`)
    } else {
      alert('Failed to update.')
    }
  }

  const uploadImage = async (file: File) => {
    if (!file) return
    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', `${uploadPreset}`)

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadImage(file)
    }
  }

  const handleStopCamera = () => {
    setShowCamera(false)
  }

  useEffect(() => {
    const textarea = document.querySelector('textarea')
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'
    }
  }, [bio])

  if (loading)
    return (
      <div className={styles.profileContainer}>
        <div className={styles.skeletonAvatar} />
        <div className={styles.profileInfo}>
          <div className={styles.skeletonTextShort} />
          <div className={styles.skeletonText} />
          <div className={styles.skeletonText} />
        </div>
      </div>
    )

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.pageContainer}>
        <div className={styles.profileContainerEdit}>
          <div className={styles.imageContainer}>
            {image && (
              <Image
                src={image}
                alt="Avatar Preview"
                width={80}
                height={80}
                className={styles.avatar}
              />
            )}
            {uploading && <div>uploading</div>}
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button type="button" onClick={() => setShowCamera(true)}>
              take a picture
            </button>
          </div>
          <div className={styles.profileInfo}>
            <input
              maxLength={30}
              className={`${styles.input} ${
                errors.name ? styles.inputError : ''
              }`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className={styles.errorContainer}>
              {errors.name && <p className={styles.error}>{errors.name}</p>}
              <div className={styles.charCount}>{name.length}/30</div>
            </div>
            <textarea
              maxLength={150}
              className={`${styles.textarea} ${
                errors.bio ? styles.inputError : ''
              }`}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <div className={styles.errorContainer}>
              {errors.bio && <p className={styles.error}>{errors.bio}</p>}
              <div className={styles.charCount}>{bio.length}/150</div>
            </div>
          </div>
        </div>
        <Modal isOpen={showCamera} onClose={handleStopCamera}>
          <CameraCapture onCapture={uploadImage} />
        </Modal>

        <Button
          id="saving-button"
          testid="saving-button"
          text={loading ? 'Saving...' : 'Save'}
          disabled={loading}
        />
      </div>
    </form>
  )
}
