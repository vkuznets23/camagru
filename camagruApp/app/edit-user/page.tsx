'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '@/styles/Profile.module.css'
import Button from '@/components/Button'
import Modal from '@/components/Modal'
import CameraCapture from '@/components/CameraCapture'
import AvatarUploader from '@/components/edituser/AvatarUploader'
import NameInput from '@/components/edituser/NameInput'
import BioInput from '@/components/edituser/BioInput'
import SkeletonLoading from '@/components/edituser/SkeletonLoading'

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

  // utils?
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

  const handleStopCamera = () => {
    setShowCamera(false)
  }

  const handleDeleteAvatar = async () => {
    try {
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete-avatar' }),
      })

      if (res.ok) {
        const data = await res.json()
        console.log('Avatar deleted:', data)
        setImage('')
      } else {
        console.error('Failed to delete avatar')
      }
    } catch (err) {
      console.error('Error deleting avatar', err)
    }
  }

  useEffect(() => {
    const textarea = document.querySelector('textarea')
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'
    }
  }, [bio])

  if (loading) return <SkeletonLoading />

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.pageContainer}>
        <div className={styles.profileContainerEdit}>
          <AvatarUploader
            image={image}
            setImage={setImage}
            onOpenCamera={() => setShowCamera(true)}
            onDelete={handleDeleteAvatar}
            uploading={uploading}
            onFileChange={(e) => {
              const file = e.target.files?.[0]
              if (file) uploadImage(file)
            }}
          />
          <div className={styles.profileBio}>
            <NameInput
              name={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />
            <BioInput
              bio={bio}
              onChange={(e) => setBio(e.target.value)}
              error={errors.bio}
            />
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
