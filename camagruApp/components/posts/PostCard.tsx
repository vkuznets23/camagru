'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import styles from '@/styles/Profile.module.css'
import PostModal from '@/components/posts/PostModal'
import { type Comment } from '@/types/comment'
import { type Post } from '@/types/post'

type PostCardProps = {
  post: Post
  onCommentAdded: (postId: string, comment: Comment) => void
  currentUserId: string
  priority?: boolean
}

export default function PostCard({
  post,
  currentUserId,
  onCommentAdded,
  priority,
}: PostCardProps) {
  const [open, setOpen] = useState(false)

  const { id, image } = post

  useEffect(() => {
    if (open) {
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
    }
  }, [open])

  return (
    <>
      <button
        className={styles.postCardWrapper}
        onClick={() => setOpen(true)}
        aria-label="open modal"
      >
        <Image
          src={image}
          alt="Post image"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          placeholder={post.blurDataURL ? 'blur' : undefined}
          blurDataURL={post.blurDataURL ?? undefined}
          style={{ objectFit: 'cover' }}
          priority={priority}
        />
        <div className={styles.overlay}>
          <span>❤️ {post.likesCount}</span>
          <span>💬 {post.comments.length}</span>
        </div>
      </button>
      {open && (
        <PostModal
          image={image}
          post={post}
          onClose={() => setOpen(false)}
          onCommentAdded={(newComment: Comment) =>
            onCommentAdded(id, newComment)
          }
          currentUserId={currentUserId}
        />
      )}
    </>
  )
}
