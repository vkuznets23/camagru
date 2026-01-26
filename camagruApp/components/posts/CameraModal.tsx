import React from 'react'
import styles from '@/styles/CameraModal.module.css'
import CameraCapture from '../camera/CameraCapture'

interface CameraModalProps {
  onClose: () => void
  onCapture: (file: File) => void
}

export default function CameraModal({ onClose, onCapture }: CameraModalProps) {
  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true">
      <div className={styles.modalContent}>
        <CameraCapture onCapture={onCapture} onClose={onClose} />
      </div>
    </div>
  )
}
