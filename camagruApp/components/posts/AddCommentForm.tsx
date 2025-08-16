'use client'

import { useState, useRef, useCallback } from 'react'
import styles from '@/styles/CommentForm.module.css'
import { type Comment } from '@/types/comment'
import { RiSendPlaneFill } from 'react-icons/ri'

const MAX_COMMENT_LENGTH = 2200
const MAX_ROWS = 3

type CommentFormProps = {
  postId: string
  onCommentAdded: (comment: Comment) => void
}

export default function CommentForm({
  postId,
  onCommentAdded,
}: CommentFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const autoResize = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = 'auto'
    const lineHeight = parseInt(
      getComputedStyle(textarea).lineHeight || '20',
      10
    )
    const maxHeight = lineHeight * MAX_ROWS

    if (textarea.scrollHeight > maxHeight) {
      textarea.style.height = `${maxHeight}px`
      textarea.style.overflowY = 'auto'
    } else {
      textarea.style.height = `${textarea.scrollHeight}px`
      textarea.style.overflowY = 'hidden'
    }
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      const textarea = textareaRef.current
      if (!textarea) return
      const trimmed = textarea.value.trim()

      if (!trimmed) return

      if (trimmed.length > MAX_COMMENT_LENGTH) {
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
          body: JSON.stringify({ content: trimmed, postId }),
        })

        if (!res.ok) throw new Error('Failed to post comment')
        const addedComment = await res.json()
        onCommentAdded(addedComment)

        textarea.value = ''
        setError('')
      } catch (err) {
        console.error('Error posting comment:', err)
        setError('Failed to send comment. Try again.')
      } finally {
        setIsSubmitting(false)
      }
    },
    [postId, onCommentAdded]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit(e as unknown as React.FormEvent)
      }
    },
    [handleSubmit]
  )

  return (
    <form
      data-testid="comment-form"
      onSubmit={handleSubmit}
      className={styles.commentForm}
    >
      <div className={styles.inputWrapper}>
        <textarea
          ref={textareaRef}
          maxLength={MAX_COMMENT_LENGTH + 100}
          onInput={() => {
            if (error) setError('')
            autoResize()
          }}
          onKeyDown={handleKeyDown}
          placeholder="Write a comment..."
          rows={1}
          required
        />
        {error && <p className={styles.error}>{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.submitButton}
        >
          <RiSendPlaneFill />
        </button>
      </div>
    </form>
  )
}
