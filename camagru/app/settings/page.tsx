'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from '@/styles/Settings.module.css'
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
  const [cameraStopping, setCameraStopping] = useState(false)

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
      router.refresh()
    } else {
      alert('Failed to update.')
    }

    setLoading(false)
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
    setCameraStopping(true)
    setShowCamera(false)
    setTimeout(() => setCameraStopping(false), 5000)
  }

  if (loading) return <div>Loading</div>

  return (
    <div className={styles.profileSettingsContainer}>
      <h1>Profile Settings</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <br />
        <label>
          Bio:
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
        </label>
        <br />
        <label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>
        <button type="button" onClick={() => setShowCamera(true)}>
          take a picture
        </button>
        {cameraStopping && <p>camera stoppping...</p>}
        <Modal isOpen={showCamera} onClose={handleStopCamera}>
          <CameraCapture onCapture={uploadImage} />
        </Modal>

        {uploading && <div>uploading</div>}
        {image && (
          <Image
            src={image}
            alt="Avatar Preview"
            width={80}
            height={80}
            className={styles.avatarPreview}
          />
        )}
        <Button
          id="saving-button"
          testid="saving-button"
          text={loading ? 'Saving...' : 'Save'}
          disabled={loading}
        />
      </form>
    </div>
  )
}
