'use client'

import styles from '@/styles/PostModal.module.css'
import { MdOutlineEdit } from 'react-icons/md'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { FcLike } from 'react-icons/fc'
import { FiHeart } from 'react-icons/fi'

export default function PostActions({
  canEdit,
  isLiked,
  likesCount,
  onDelete,
  onEdit,
  onToggleLike,
}: {
  canEdit: boolean
  isLiked: boolean
  likesCount: number
  onDelete: () => void
  onEdit: () => void
  onToggleLike: () => void
}) {
  return (
    <div className={styles.postAction}>
      {canEdit && (
        <>
          <button className={styles.deleteButton} onClick={onDelete}>
            <RiDeleteBin6Line /> Delete
          </button>
          <button className={styles.editButton} onClick={onEdit}>
            <MdOutlineEdit /> Edit
          </button>
        </>
      )}
      <button
        data-testid="likeBtn"
        className={styles.likeButton}
        onClick={onToggleLike}
      >
        {isLiked ? <FcLike /> : <FiHeart />}
        {likesCount}
      </button>
    </div>
  )
}
