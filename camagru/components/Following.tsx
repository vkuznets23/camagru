import React from 'react'
import { prisma } from '@/utils/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface FollowingProps {
  userId: string
}

export default async function Following({ userId }: FollowingProps) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      followers: {
        select: {
          follower: {
            id: true,
            username: true,
            image: true,
          },
        },
      },
    },
  })

  if (!user) return notFound()
  return <div></div>
}
