'use client'

import Image from 'next/image'
import styles from '@/styles/PostModal.module.css'
import { type Comment } from '@/types/comment'
import CommentForm from '@/components/posts/AddCommentForm'
import CommentList from '@/components/posts/CommentsList'
import { useState } from 'react'
import { usePosts } from '@/context/PostsContext'
import { type Post } from '@/types/post'
import UserInfo from '@/components/posts/PostModalUserInfo'
import PostActions from '@/components/posts/PostModalPostActions'

type PostModalProps = {
  post: Post
  image: string
  onClose: () => void
  onCommentAdded: (comment: Comment) => void
  currentUserId: string
}

export default function PostModal({
  image,
  post,
  onClose,
  currentUserId,
  onCommentAdded,
}: PostModalProps) {
  const {
    id: postId,
    content,
    createdAt,
    user: { username, image: avatar, id: userID },
    likesCount,
    comments,
  } = post

  const isLiked = post.likedByCurrentUser ?? false
  const canEdit = userID === currentUserId

  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content || '')

  const {
    handleEditPost,
    handleToggleLike,
    handlePostDeleted,
    handleCommentDeleted,
  } = usePosts()

  const handleSave = () => {
    handleEditPost(postId, editedContent)
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
              <UserInfo
                username={username}
                avatar={avatar}
                createdAt={createdAt}
              />
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
                    <PostActions
                      canEdit={canEdit}
                      isLiked={isLiked}
                      likesCount={likesCount}
                      onDelete={() => handlePostDeleted(postId)}
                      onEdit={() => setIsEditing(true)}
                      onToggleLike={() => handleToggleLike(postId)}
                    />
                  </>
                )}
              </div>
            </div>
            <CommentList
              currentUserId={currentUserId}
              comments={comments}
              onCommentDeleted={(commentId) =>
                handleCommentDeleted(postId, commentId)
              }
              postAuthorId={userID}
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
