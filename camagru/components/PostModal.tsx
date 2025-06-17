'use client'

import Image from 'next/image'
import styles from '@/styles/PostModal.module.css'

type PostModalProps = {
  image: string
  content: string
  createdAt: string
  onClose: () => void
}

export default function PostModal({
  image,
  content,
  createdAt,
  onClose,
}: PostModalProps) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.imageWrapper}>
          <Image
            src={image}
            alt="Post"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className={styles.imageWrapperImg}
          />
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.info}>
            <p>{content}</p>
            <small>{new Date(createdAt).toLocaleString()}</small>
          </div>
        </div>
        <button onClick={onClose} className={styles.closeBtn}>
          ×
        </button>
      </div>
    </div>
  )
}
