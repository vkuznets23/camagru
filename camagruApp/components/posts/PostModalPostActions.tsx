'use client'

import styles from '@/styles/PostModal.module.css'
import { MdOutlineEdit } from 'react-icons/md'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { FcLike } from 'react-icons/fc'
import { FiHeart } from 'react-icons/fi'
import { useState } from 'react'

export default function PostActions({
  canEdit,
  isLiked: initialLiked,
  likesCount: initialLikesCount,
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
  const [isLiked, setIsLiked] = useState(initialLiked)
  const [likesCount, setLikesCount] = useState(initialLikesCount)

  const handleLike = async () => {
    if (isLiking) return

    const previousLiked = isLiked
    const previousCount = likesCount

    setIsLiked(!previousLiked)
    setLikesCount(previousLiked ? likesCount - 1 : likesCount + 1)
    setIsLiking(true)

    try {
      await onToggleLike()
    } catch (err) {
      console.error('Failed to like', err)
      setIsLiked(previousLiked)
      setLikesCount(previousCount)
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <div className={styles.postAction}>
      {canEdit && (
        <>
          <button className={styles.deleteButton} onClick={onDelete}>
            <RiDeleteBin6Line /> <span>Delete</span>
          </button>
          <button className={styles.editButton} onClick={onEdit}>
            <MdOutlineEdit /> <span>Edit</span>
          </button>
        </>
      )}
      <button
        data-testid="likeBtn"
        className={styles.likeButton}
        onClick={handleLike}
        disabled={isLiking}
      >
        {isLiked ? <FcLike /> : <FiHeart />}
        <span>{likesCount}</span>
      </button>
    </div>
  )
}
