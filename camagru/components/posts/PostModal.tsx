'use client'

import Image from 'next/image'
import styles from '@/styles/PostModal.module.css'
import { type Comment } from '@/types/comment'
import CommentForm from './AddCommentForm'
import CommentList from './CommentsList'
import { FcLike } from 'react-icons/fc'
import { FiHeart } from 'react-icons/fi'

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
  onCommentAdded: (comment: Comment) => void
  onCommentDeleted: (commentId: string) => void
  onPostDeleted: (postId: string) => void
  onToggleLike: (postId: string) => void
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
  onCommentAdded,
  onCommentDeleted,
  onPostDeleted,
  onToggleLike,
}: PostModalProps) {
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
              <p className={styles.postContent}>{content}</p>
              <div className={styles.postAction}>
                <button onClick={() => onPostDeleted(postId)}>delete</button>
                <button>edit</button>
                <button onClick={() => onToggleLike(postId)}>
                  {isLiked ? <FcLike /> : <FiHeart />}
                  {likesCount}
                </button>
              </div>
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
