'use client'

import Image from 'next/image'
import { useState } from 'react'
import PostModal from './PostModal'
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
      <div
        style={{
          width: 270,
          height: 270,
          position: 'relative',
          cursor: 'pointer',
        }}
        onClick={() => setOpen(true)}
      >
        <Image
          src={image}
          alt="Post image"
          width={270}
          height={270}
          priority
          style={{ objectFit: 'cover' }}
        />
      </div>
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
