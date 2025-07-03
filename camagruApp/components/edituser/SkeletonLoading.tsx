import React from 'react'
import styles from '@/styles/Profile.module.css'

export default function SkeletonLoading() {
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
}
