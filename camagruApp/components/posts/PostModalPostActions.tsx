'use client'

import styles from '@/styles/PostModal.module.css'
import { MdOutlineEdit } from 'react-icons/md'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { FaRegBookmark, FaBookmark } from 'react-icons/fa'
import { FcLike } from 'react-icons/fc'
import { FiHeart } from 'react-icons/fi'
import { useState } from 'react'

export default function PostActions({
  canEdit,
  isLiked: initialLiked,
  likesCount: initialLikesCount,
  isSaved: initialSaved,
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
  const [isLiked, setIsLiked] = useState(initialLiked)
  const [likesCount, setLikesCount] = useState(initialLikesCount)

  const [isSavingPost, setIsSavingPost] = useState(false)
  const [isSaved, setIsSaved] = useState(initialSaved)

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

  const handleSave = async () => {
    if (isSavingPost) return

    const previousSaved = isSaved
    setIsSaved(!previousSaved)
    setIsSavingPost(true)

    try {
      await onToggleSave()
    } catch (err) {
      console.error('Failed to save', err)
      setIsSaved(previousSaved)
    } finally {
      setIsSavingPost(false)
    }
  }

  return (
    <div className={styles.postAction}>
      {canEdit && (
        <>
          <button
            className={styles.deleteButton}
            onClick={onDelete}
            aria-label="Delete post"
          >
            <RiDeleteBin6Line /> <span>Delete</span>
          </button>
          <button
            className={styles.editButton}
            onClick={onEdit}
            aria-label="Edit post"
          >
            <MdOutlineEdit /> <span>Edit</span>
          </button>
        </>
      )}
      <button
        data-testid="likeBtn"
        className={styles.likeButton}
        onClick={handleLike}
        disabled={isLiking}
        aria-label={
          isLiked
            ? `Unlike post (${likesCount} likes)`
            : `Like post (${likesCount} likes)`
        }
      >
        {isLiked ? <FcLike /> : <FiHeart />}
        <span>{likesCount}</span>
      </button>
      <button
        data-testid="saveBtn"
        className={`${styles.saveButton} ${
          isSaved ? styles.saved : styles.unsaved
        }`}
        onClick={handleSave}
        disabled={isSavingPost}
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
