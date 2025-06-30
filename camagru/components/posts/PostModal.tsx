'use client'

import Image from 'next/image'
import styles from '@/styles/PostModal.module.css'
import { type Comment } from '@/types/comment'
import CommentForm from './AddCommentForm'
import CommentList from './CommentsList'
import { FcLike } from 'react-icons/fc'
import { FiHeart } from 'react-icons/fi'
import { useState } from 'react'
import { MdOutlineEdit } from 'react-icons/md'
import { RiDeleteBin6Line } from 'react-icons/ri'

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
  postAuthorId: string
  onCommentAdded: (comment: Comment) => void
  onCommentDeleted: (commentId: string) => void
  onPostDeleted: (postId: string) => void
  onToggleLike: (postId: string) => void
  onEditPost: (newContent: string) => void
  currentUserId: string
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
  currentUserId,
  postAuthorId,
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
                {isEditing ? (
                  <div className={styles.editSection}>
                    <textarea
                      className={styles.textarea}
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                    />
                    <div className={styles.editButtons}>
                      <button onClick={handleSave}>Save</button>
                      <button onClick={() => setIsEditing(false)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className={styles.postContent}>{content}</p>
                    <div className={styles.postAction}>
                      {canEdit && (
                        <>
                          <button
                            className={styles.deleteButton}
                            onClick={() => onPostDeleted(postId)}
                          >
                            <RiDeleteBin6Line /> Delete
                          </button>
                          <button
                            className={styles.editButton}
                            onClick={() => setIsEditing(true)}
                          >
                            <MdOutlineEdit /> Edit
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
                      {/* <button> save </button> */}
                    </div>
                  </>
                )}
              </div>
            </div>
            <CommentList
              currentUserId={currentUserId}
              comments={comments}
              onCommentDeleted={onCommentDeleted}
              postAuthorId={postAuthorId}
            />
          </div>
          <CommentForm postId={postId} onCommentAdded={onCommentAdded} />
        </div>
        <button onClick={onClose} className={styles.closeBtn}>
          ×
        </button>
      </div>
    </div>
  )
}
