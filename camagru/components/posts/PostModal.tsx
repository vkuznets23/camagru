'use client'

import Image from 'next/image'
import styles from '@/styles/PostModal.module.css'
import { type Comment } from '@/types/commet'
import { useState } from 'react'

type PostModalProps = {
  image: string
  content: string
  createdAt: string
  onClose: () => void
  username?: string
  avatar?: string
  comments: Comment[]
  postId: string
}

export default function PostModal({
  image,
  content,
  createdAt,
  onClose,
  username,
  avatar,
  comments,
  postId,
}: PostModalProps) {
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [commentsList, setCommentsList] = useState<Comment[]>(comments)

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
      setCommentsList([addedComment, ...commentsList])
      setNewComment('')
    } catch (err) {
      console.error('Failed to post comment', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.imageWrapper}>
          <Image
            src={image}
            alt="Post"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className={styles.imageWrapperImg}
          />
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.info}>
            <div className={styles.usernamePanel}>
              <Image
                className={styles.avatar}
                src={avatar || '/default_avatar.png'}
                alt="avatar"
                width={100}
                height={100}
              />
              <p className={styles.username}>{username}</p>
            </div>
            <p>{content}</p>
            <small>{new Date(createdAt).toLocaleString()}</small>
            {commentsList.map((comment) => (
              <div key={comment.id}>
                <p>
                  <strong>{comment.user.username}</strong>: {comment.content}
                </p>
                <small>{new Date(comment.createdAt).toLocaleString()}</small>
              </div>
            ))}
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
          </div>
        </div>
        <button onClick={onClose} className={styles.closeBtn}>
          ×
        </button>
      </div>
    </div>
  )
}
