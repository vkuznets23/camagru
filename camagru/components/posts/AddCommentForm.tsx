'use client'

import { useState } from 'react'
import styles from '@/styles/CommenForm.module.css'
import { type Comment } from '@/types/comment'

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment, postId }),
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
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Write a comment..."
        rows={2}
        required
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Posting...' : 'Post'}
      </button>
    </form>
  )
}
