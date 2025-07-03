import styles from '@/styles/divider.module.css'
import { GrGrid } from 'react-icons/gr'
import { LuBookmark } from 'react-icons/lu'

interface DividerProps {
  activeTab: 'posts' | 'saved'
  setActiveTab: (tab: 'posts' | 'saved') => void
}

export default function Divider({ activeTab, setActiveTab }: DividerProps) {
  return (
    <div id="divider" data-testid="divider" className={styles.divider}>
      <div className={styles.sections}>
        <div
          className={`${styles.section} ${
            activeTab === 'posts' ? styles.active : ''
          }`}
          onClick={() => setActiveTab('posts')}
        >
          <GrGrid />
          <p>Posts</p>
        </div>
        <div
          className={`${styles.section} ${
            activeTab === 'saved' ? styles.active : ''
          }`}
          onClick={() => setActiveTab('saved')}
        >
          <LuBookmark />
          <p>Saved</p>
        </div>
      </div>
    </div>
  )
}
