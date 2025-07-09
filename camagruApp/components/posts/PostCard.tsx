'use client'

import Image from 'next/image'
import { useState } from 'react'
import styles from '@/styles/Profile.module.css'
import PostModal from '@/components/posts/PostModal'
import { type Comment } from '@/types/comment'
import { type Post } from '@/types/post'

type PostCardProps = {
  post: Post
  onCommentAdded: (postId: string, comment: Comment) => void
  currentUserId: string
}

export default function PostCard({
  post,
  currentUserId,
  onCommentAdded,
}: PostCardProps) {
  const [open, setOpen] = useState(false)

  const { id, image } = post

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
          priority
          style={{ objectFit: 'cover' }}
        />
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
