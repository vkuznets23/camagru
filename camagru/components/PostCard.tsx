'use client'

import Image from 'next/image'
import { useState } from 'react'
import PostModal from './PostModal'

type PostCardProps = {
  id: string
  image: string
  content: string
  createdAt: string
}

export default function PostCard({ image, content, createdAt }: PostCardProps) {
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
        />
      )}
    </>
  )
}
