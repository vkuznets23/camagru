'use client'

import Image from 'next/image'
import styles from '@/styles/PostModal.module.css'
import { type Comment } from '@/types/comment'
import CommentForm from '@/components/posts/AddCommentForm'
import CommentList from '@/components/posts/CommentsList'
import { useEffect, useRef, useState } from 'react'
import { type Post } from '@/types/post'
import UserInfo from '@/components/posts/PostModalUserInfo'
import PostActions from '@/components/posts/PostModalPostActions'
import { useUser } from '@/context/userContext'

type PostModalProps = {
  post: Post
  image: string
  onClose: () => void
  onCommentAdded: (comment: Comment) => void
  currentUserId: string
}

const MAX_LINES = 20
const MAX_CHARS = 500

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
  const [isSaving, setIsSaving] = useState(false)
  const [showFullContent, setShowFullContent] = useState(false)

  const editTextareaRef = useRef<HTMLTextAreaElement>(null)

  const safeContent = content || ''
  const lines = safeContent.split('\n')

  const shouldShowButton =
    !showFullContent &&
    (lines.length > MAX_LINES || safeContent.length > MAX_CHARS)

  const truncatedByLines = lines.slice(0, MAX_LINES).join('\n')
  const truncatedByChars = safeContent.slice(0, MAX_CHARS)

  const displayedContent = showFullContent
    ? safeContent
    : truncatedByLines.length < truncatedByChars.length
    ? truncatedByLines
    : truncatedByChars

  const { editPost, toggleLike, deletePost, deleteComment } = useUser()

  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.innerWidth > 820) return
    const modalEl = modalRef.current
    if (!modalEl) return

    const setModalHeight = () => {
      modalEl.style.height = `${window.innerHeight}px`
    }

    setModalHeight()

    let startY = 0
    let currentY = 0
    let isDragging = false

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY
      isDragging = true
      modalEl.style.transition = 'none'
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return
      currentY = e.touches[0].clientY - startY
      if (currentY > 0) {
        e.preventDefault()
        modalEl.style.transform = `translateY(${currentY}px)`
        const overlayEl = modalEl.parentElement
        if (overlayEl) {
          overlayEl.style.background = `rgba(0,0,0,${0.7 - currentY / 600})`
        }
      }
    }

    const handleTouchEnd = () => {
      isDragging = false
      const overlayEl = modalEl.parentElement
      if (currentY > 150) {
        if (overlayEl) overlayEl.style.opacity = '0'
        setTimeout(() => onClose(), 200)
      } else {
        modalEl.style.transition = 'transform 0.3s'
        modalEl.style.transform = 'translateY(0)'
        if (overlayEl) overlayEl.style.background = 'rgba(0,0,0,0.7)'
      }
      currentY = 0
    }

    modalEl.addEventListener('touchstart', handleTouchStart, { passive: false })
    modalEl.addEventListener('touchmove', handleTouchMove, { passive: false })
    modalEl.addEventListener('touchend', handleTouchEnd)
    window.addEventListener('resize', setModalHeight)

    return () => {
      modalEl.removeEventListener('touchstart', handleTouchStart)
      modalEl.removeEventListener('touchmove', handleTouchMove)
      modalEl.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('resize', setModalHeight)
    }
  }, [onClose])

  const handleSave = async () => {
    if (!editTextareaRef.current) return
    const newContent = editTextareaRef.current.value
    setIsSaving(true)
    await editPost(postId, newContent)
    setEditedContent(newContent)
    setIsSaving(false)
    setIsEditing(false)
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }

      if (e.key === 'Tab') {
        if (!modalRef.current) return

        const focusableElements =
          modalRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
          )
        const focusable = Array.from(focusableElements).filter(
          (el) =>
            el.offsetWidth > 0 ||
            el.offsetHeight > 0 ||
            el === document.activeElement
        )
        if (focusable.length === 0) return

        const firstElement = focusable[0]
        const lastElement = focusable[focusable.length - 1]
        const isShift = e.shiftKey
        const active = document.activeElement

        if (isShift && active === firstElement) {
          e.preventDefault()
          lastElement.focus()
        } else if (!isShift && active === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)

    if (modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      )
      const focusable = Array.from(focusableElements).filter(
        (el) => el.offsetWidth > 0 || el.offsetHeight > 0
      )
      if (focusable.length > 0) {
        focusable[0].focus()
      } else {
        modalRef.current.focus()
      }
    }
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        ref={modalRef}
        tabIndex={-1}
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.dragHandle} />
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
          <div className={styles.topContent}>
            <div className={styles.info}>
              <div className={styles.infodivider}>
                <UserInfo
                  username={username}
                  avatar={avatar}
                  createdAt={createdAt}
                  userID={userID}
                />

                <div>
                  {isEditing ? (
                    <div className={styles.editSection}>
                      <textarea
                        data-testid="edit-post"
                        onKeyDown={handleKeyDown}
                        className={styles.textarea}
                        ref={editTextareaRef}
                        defaultValue={editedContent}
                      />
                      <div className={styles.editButtons}>
                        <button onClick={handleSave} disabled={isSaving}>
                          {isSaving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          disabled={isSaving}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className={styles.postContent}>
                        {displayedContent}
                        {shouldShowButton && (
                          <button
                            className={styles.showMoreButton}
                            onClick={() => setShowFullContent(true)}
                          >
                            ...show all
                          </button>
                        )}
                      </p>
                      <PostActions
                        canEdit={canEdit}
                        isLiked={isLiked}
                        likesCount={likesCount}
                        onDelete={() => deletePost(postId)}
                        onEdit={() => setIsEditing(true)}
                        onToggleLike={() => toggleLike(postId)}
                      />
                    </>
                  )}
                </div>
              </div>
              <CommentList
                currentUserId={currentUserId}
                comments={comments}
                onCommentDeleted={(commentId) =>
                  deleteComment(postId, commentId)
                }
                postAuthorId={userID}
              />
            </div>
          </div>
          <div className={styles.commentForm}>
            <CommentForm postId={postId} onCommentAdded={onCommentAdded} />
          </div>
        </div>

        <button onClick={onClose} className={styles.closeBtn}>
          ×
        </button>
      </div>
    </div>
  )
}
