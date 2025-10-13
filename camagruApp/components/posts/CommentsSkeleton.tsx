import styles from '@/styles/CommentList.module.css'

export default function CommentsSkeleton() {
  return (
    <div className={styles.commentsSection}>
      {[1, 2, 3].map((i) => (
        <div key={i} className={styles.commentBlock}>
          <div className={styles.commentHeader}>
            <div className={styles.commentHeader}>
              <div
                className={styles.skeletonAvatar}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
              <div className={styles.commentMeta}>
                <div
                  className={styles.skeleton}
                  style={{
                    width: '120px',
                    height: '14px',
                    marginBottom: '4px',
                    borderRadius: '4px',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}
                />
                <div
                  className={styles.skeleton}
                  style={{
                    width: '90px',
                    height: '12px',
                    borderRadius: '4px',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}
                />
              </div>
            </div>
          </div>
          <div
            className={styles.skeleton}
            style={{
              width: '100%',
              height: '14px',
              marginTop: '8px',
              borderRadius: '4px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
          <div
            className={styles.skeleton}
            style={{
              width: '80%',
              height: '14px',
              marginTop: '6px',
              borderRadius: '4px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
        </div>
      ))}
    </div>
  )
}
