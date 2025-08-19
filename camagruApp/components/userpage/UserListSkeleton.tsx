'use client'

import styles from '@/styles/FollowersPage.module.css'

export default function UserListSkeleton({
  noPadding = false,
}: {
  noPadding?: boolean
}) {
  return (
    <div className={noPadding ? styles.noPaddingContainer : styles.container}>
      <ul className={styles.list}>
        {Array.from({ length: 8 }).map((_, i) => (
          <li key={i} className={styles.userRow}>
            <div className={styles.item}>
              <div className={styles.skeletonAvatar} />
              <div className={styles.userInfo}>
                <div
                  className={`${styles.skeleton}`}
                  style={{ width: '120px', height: '16px' }}
                />
                <div
                  className={`${styles.skeleton}`}
                  style={{ width: '180px', height: '12px', marginTop: '4px' }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
