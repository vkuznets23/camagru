'use client'

import Image from 'next/image'
import { useState } from 'react'
import PostModal from './PostModal'
import { type Comment } from '@/types/comment'

type PostCardProps = {
  id: string
  image: string
  username?: string
  avatar?: string
  content: string
  createdAt: string
  comments: Comment[]
  isLiked?: boolean
  likesCount: number
  canEdit: boolean
  onCommentAdded: (postId: string, comment: Comment) => void
  onCommentDeleted: (commentId: string) => void
  onPostDeleted: (postId: string) => void
  onToggleLike: (postId: string) => void
  onEditPost: (newContent: string) => void
}

export default function PostCard({
  id,
  image,
  content,
  createdAt,
  username,
  avatar,
  comments,
  isLiked,
  likesCount,
  canEdit,
  onCommentAdded,
  onCommentDeleted,
  onPostDeleted,
  onToggleLike,
  onEditPost,
}: PostCardProps) {
  const [open, setOpen] = useState(false)

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
          style={{ objectFit: 'cover' }}
        />
      </div>
      {open && (
        <PostModal
          image={image}
          content={content}
          createdAt={createdAt}
          onClose={() => setOpen(false)}
          username={username}
          avatar={avatar}
          comments={comments}
          postId={id}
          onCommentAdded={(newComment: Comment) =>
            onCommentAdded(id, newComment)
          }
          onCommentDeleted={onCommentDeleted}
          onPostDeleted={onPostDeleted}
          isLiked={isLiked}
          likesCount={likesCount}
          onToggleLike={onToggleLike}
          canEdit={canEdit}
          onEditPost={onEditPost}
        />
      )}
    </>
  )
}
