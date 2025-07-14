import styles from '@/styles/Profile.module.css'

export default function UserSkeleton() {
  return (
    <div>
      <div
        data-testid="skeleton"
        className={styles.profileContainer}
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <span className={styles.visuallyHidden}>Loading profile...</span>
        <div className={styles.skeletonAvatar} />
        <div className={styles.profileInfo}>
          <div className={styles.skeletonTextShort} />
          <div className={styles.skeletonText} />
          <div className={styles.skeletonText} />
        </div>
      </div>
      <div className={styles.posts}>
        <div className={styles.postsContainer}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeletonPost} />
          ))}
        </div>
      </div>
    </div>
  )
}
