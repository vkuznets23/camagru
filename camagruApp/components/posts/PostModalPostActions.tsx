'use client'

import styles from '@/styles/PostModal.module.css'
import { FaRegBookmark, FaBookmark } from 'react-icons/fa'
import { MdOutlineEdit } from 'react-icons/md'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { FcLike } from 'react-icons/fc'
import { FiHeart } from 'react-icons/fi'
import { useState } from 'react'

export default function PostActions({
  canEdit,
  isLiked,
  isSaved,
  likesCount,
  onDelete,
  onEdit,
  onToggleLike,
  onToggleSave,
}: {
  canEdit: boolean
  isLiked: boolean
  isSaved: boolean
  likesCount: number
  onDelete: () => void
  onEdit: () => void
  onToggleLike: () => Promise<void>
  onToggleSave: () => Promise<void>
}) {
  const [isLiking, setIsLiking] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

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

  const handleSave = async () => {
    if (isSaving) return
    setIsSaving(true)
    try {
      await onToggleSave()
    } catch (err) {
      console.error('Failed to save', err)
    } finally {
      setIsSaving(false)
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
        onClick={handleLike}
        disabled={isLiking}
      >
        {isLiked ? <FcLike /> : <FiHeart />}
        {likesCount}
      </button>
      <button
        data-testid="saveBtn"
        className={`${styles.saveButton} ${
          isSaved ? styles.saved : styles.unsaved
        }`}
        onClick={handleSave}
        disabled={isSaving}
        aria-label={isSaved ? 'Unsave post' : 'Save post'}
      >
        {isSaved ? (
          <>
            <FaBookmark /> <span>Saved</span>
          </>
        ) : (
          <>
            <FaRegBookmark /> <span>Save</span>
          </>
        )}
      </button>
    </div>
  )
}
