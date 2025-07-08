'use client'

import styles from '@/styles/PostModal.module.css'
import { MdOutlineEdit } from 'react-icons/md'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { FcLike } from 'react-icons/fc'
import { FiHeart } from 'react-icons/fi'
import { useState } from 'react'

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
  onToggleLike: () => Promise<void>
}) {
  const [isLiking, setIsLiking] = useState(false)

  const handleLike = async () => {
    if (isLiking) return
    setIsLiking(true)
    try {
      await onToggleLike()
    } catch (err) {
      console.error('Failed to like', err)
    } finally {
      setIsLiking(false)
    }
  }

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
        // onClick={onToggleLike}
        onClick={handleLike}
        disabled={isLiking}
      >
        {isLiked ? <FcLike /> : <FiHeart />}
        {likesCount}
      </button>
    </div>
  )
}
