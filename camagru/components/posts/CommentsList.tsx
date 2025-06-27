'use client'

import Image from 'next/image'
import styles from '@/styles/CommentList.module.css'
import { type Comment } from '@/types/comment'

type CommentListProps = {
  comments: Comment[]
  onCommentDeleted: (commentId: string) => void
  currentUserId: string
}

export default function CommentList({
  comments,
  onCommentDeleted,
  currentUserId,
}: CommentListProps) {
  if (comments.length == 0)
    return (
      <div className={styles.noCommentsWrapper}>
        <h4>No comments yet</h4>
        <p>Start the conversation</p>
      </div>
    )
  return (
    <div className={styles.commentsSection}>
      {comments.map((comment) => {
        console.log(
          'comment.user.id:',
          comment.user.id,
          'currentUserId:',
          currentUserId
        )
        const canDelete = comment.user.id === currentUserId
        console.log(
          'comment.user.id:',
          comment.user.id,
          'currentUserId:',
          currentUserId
        )

        return (
          <div key={comment.id} className={styles.commentBlock}>
            <div className={styles.commentHeader}>
              <Image
                className={styles.commentAvatar}
                src={comment.user.image || '/default_avatar.png'}
                alt="user avatar"
                width={32}
                height={32}
              />
              <div className={styles.commentMeta}>
                <p className={styles.commentUsername}>
                  {comment.user.username}
                </p>
                <small className={styles.commentDate}>
                  {new Date(comment.createdAt).toLocaleString()}
                </small>
              </div>
            </div>
            <p className={styles.commentContent}>{comment.content}</p>

            <div className={styles.actionsWrapper}>
              {canDelete && (
                <button
                  className={styles.deleteButton}
                  onClick={() => {
                    console.log('Delete clicked:', comment.id)
                    onCommentDeleted(comment.id)
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
