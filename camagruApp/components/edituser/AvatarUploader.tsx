import { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from '@/styles/Profile.module.css'

interface Props {
  image: string
  setImage: (url: string) => void
  onOpenCamera: () => void
  onDelete: () => void
  uploading: boolean
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function AvatarUploader({
  image,
  onOpenCamera,
  onDelete,
  uploading,
  onFileChange,
}: Props) {
  const [showOptions, setShowOptions] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 600)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className={styles.imageContainer}>
      <div className={styles.avatarWrapper}>
        <Image
          src={image || '/default_avatar.png'}
          alt={image ? 'User avatar preview' : 'Default avatar image'}
          width={80}
          height={80}
          className={styles.avatar}
        />
        {uploading && (
          <div
            className={styles.uploadingOverlay}
            role="status"
            aria-live="polite"
          >
            <div className={styles.spinner}></div>
          </div>
        )}
      </div>

      <div className={styles.photoOptionsWrapper}>
        {!isMobile && (
          <button
            type="button"
            className={styles.secondBtn}
            onClick={() => setShowOptions((prev) => !prev)}
            aria-expanded={showOptions}
            aria-controls="avatar-options"
          >
            {showOptions ? 'Close' : 'Edit photo'}
          </button>
        )}

        {(showOptions || isMobile) && (
          <div
            id="avatar-options"
            role="menu"
            className={styles.editBtnsContainer}
          >
            <label className={styles.option} role="menuitem">
              Upload from gallery
              <input
                aria-label="Upload new avatar"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className={styles.hiddenInput}
              />
            </label>
            <button
              aria-label="Open camera to take new avatar"
              className={styles.option}
              type="button"
              role="menuitem"
              onClick={onOpenCamera}
            >
              Take a picture
            </button>
            <button
              aria-label="Delete current avatar"
              className={styles.option}
              type="button"
              role="menuitem"
              onClick={onDelete}
            >
              Remove photo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
