'use client'

import Image from 'next/image'
import styles from '@/styles/PostModal.module.css'
import { type Comment } from '@/types/comment'
import CommentForm from './AddCommentForm'
import CommentList from './CommentsList'
import { FcLike } from 'react-icons/fc'
import { FiHeart } from 'react-icons/fi'
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
  isLiked?: boolean
  likesCount: number
  canEdit: boolean
  onCommentAdded: (comment: Comment) => void
  onCommentDeleted: (commentId: string) => void
  onPostDeleted: (postId: string) => void
  onToggleLike: (postId: string) => void
  onEditPost: (newContent: string) => void
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
  isLiked,
  likesCount,
  canEdit,
  onCommentAdded,
  onCommentDeleted,
  onPostDeleted,
  onToggleLike,
  onEditPost,
}: PostModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content || '')

  const handleSave = () => {
    onEditPost(editedContent)
    setIsEditing(false)
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
            <div className={styles.infodivider}>
              <div className={styles.usernamePanel}>
                <Image
                  className={styles.avatar}
                  src={avatar || '/default_avatar.png'}
                  alt="avatar"
                  width={32}
                  height={32}
                />
                <div className={styles.postMeta}>
                  <p className={styles.username}>{username}</p>
                  <small className={styles.postDate}>
                    {new Date(createdAt).toLocaleString()}
                  </small>
                </div>
              </div>
              <div>
                {/* Режим редактирования */}
                {isEditing ? (
                  <div className={styles.editSection}>
                    <textarea
                      className={styles.textarea}
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                    />
                    <div className={styles.editButtons}>
                      <button onClick={handleSave}>💾 Сохранить</button>
                      <button onClick={() => setIsEditing(false)}>
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className={styles.postContent}>{content}</p>
                    <div className={styles.postAction}>
                      {canEdit && (
                        <>
                          <button onClick={() => onPostDeleted(postId)}>
                            Delete
                          </button>
                          <button onClick={() => setIsEditing(true)}>
                            Edit
                          </button>
                        </>
                      )}
                      <button
                        className={styles.likeButton}
                        onClick={() => onToggleLike(postId)}
                      >
                        {isLiked ? <FcLike /> : <FiHeart />}
                        {likesCount}
                      </button>
                    </div>
                  </>
                )}
              </div>
              {/* <p className={styles.postContent}>{content}</p>
              <div className={styles.postAction}>
                <button onClick={() => onPostDeleted(postId)}>delete</button>
                <button>edit</button>
                <button
                  className={styles.likeButton}
                  onClick={() => onToggleLike(postId)}
                >
                  {isLiked ? <FcLike /> : <FiHeart />}
                  {likesCount}
                </button>
              </div> */}
            </div>
            <CommentList
              comments={comments}
              onCommentDeleted={onCommentDeleted}
            />
          </div>
          <CommentForm
            postId={postId}
            onCommentAdded={onCommentAdded}
            userAvatar={avatar}
          />
        </div>
        <button onClick={onClose} className={styles.closeBtn}>
          ×
        </button>
      </div>
    </div>
  )
}
