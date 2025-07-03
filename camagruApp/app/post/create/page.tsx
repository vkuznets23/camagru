'use client'

import AddPost from '@/components/posts/AddPost'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function CreatePostPage() {
  const { data: session } = useSession()
  const router = useRouter()

  const handlePostAdded = () => {
    if (session?.user?.id) {
      router.push(`/user/${session.user.id}`)
    } else {
      router.push('/')
    }
  }
  return (
    <div>
      <AddPost onPostAdded={handlePostAdded} />
    </div>
  )
}
