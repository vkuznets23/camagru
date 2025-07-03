import { useState } from 'react'
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

  return (
    <div className={styles.imageContainer}>
      <Image
        src={image || '/default_avatar.png'}
        alt="Avatar Preview"
        width={80}
        height={80}
        className={styles.avatar}
      />
      {uploading && <div>uploading...</div>}

      <div className={styles.photoOptionsWrapper}>
        <button
          type="button"
          className={styles.secondBtn}
          onClick={() => setShowOptions((prev) => !prev)}
        >
          {showOptions ? 'Close' : 'Edit photo'}
        </button>

        {showOptions && (
          <div className={styles.editBtnsContainer}>
            <label className={styles.option}>
              Upload from gallery
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className={styles.hiddenInput}
              />
            </label>
            <button
              className={styles.option}
              type="button"
              onClick={onOpenCamera}
            >
              take a picture
            </button>
            <button className={styles.option} type="button" onClick={onDelete}>
              remove photo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
