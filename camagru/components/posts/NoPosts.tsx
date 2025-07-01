import styles from '@/styles/Profile.module.css'
import { PiCameraThin } from 'react-icons/pi'

export default function NoPosts() {
  return (
    <div className={styles.noPostsWrapper}>
      <div className={styles.noPosts}>
        <div className={styles.noPostsPicWrapper}>
          <PiCameraThin className={styles.noPostsPic} />
        </div>
        <p>No posts yet.</p>
      </div>
    </div>
  )
}
