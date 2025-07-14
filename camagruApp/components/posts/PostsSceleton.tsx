import styles from '@/styles/Skeleton.module.css'

export default function PostSkeleton() {
  return (
    <div className={styles.postSkeletonWrapper}>
      <div className={styles.postSkeleton} />
    </div>
  )
}
