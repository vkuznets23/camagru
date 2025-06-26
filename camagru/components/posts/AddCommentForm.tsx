'use client'

import { useState } from 'react'
import styles from '@/styles/CommentForm.module.css'
import { FaArrowUp } from 'react-icons/fa'
import { type Comment } from '@/types/comment'

const MAX_COMMENT_LENGTH = 2200

type CommentFormProps = {
  postId: string
  onCommentAdded: (comment: Comment) => void
}

export default function CommentForm({
  postId,
  onCommentAdded,
}: CommentFormProps) {
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedComment = newComment.trim()
    if (!trimmedComment) return

    if (trimmedComment.length > MAX_COMMENT_LENGTH) {
      setError(
        `Comment is too long. Maximum is ${MAX_COMMENT_LENGTH} characters.`
      )
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          postId,
        }),
      })

      if (!res.ok) throw new Error('Failed to post comment')
      const addedComment = await res.json()
      onCommentAdded(addedComment)
      setNewComment('')
    } catch (err) {
      console.error('Error posting comment:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.commentForm}>
      <div className={styles.inputWrapper}>
        <textarea
          value={newComment}
          maxLength={MAX_COMMENT_LENGTH + 100}
          onChange={(e) => {
            setNewComment(e.target.value)
            if (error) setError('')
          }}
          placeholder="Write a comment..."
          rows={1}
          required
        />
        {error && <p className={styles.error}>{error}</p>}
        {newComment.length > 0 && (
          <button type="submit" disabled={isSubmitting}>
            <FaArrowUp />
          </button>
        )}
      </div>
    </form>
  )
}
