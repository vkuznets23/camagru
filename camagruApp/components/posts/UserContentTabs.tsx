import React, { useState } from 'react'
import Divider from '@/components/posts/Divider'
import { type Post } from '@/types/post'
import UserPosts from '@/components/posts/Posts'
import { User } from '@/types/user'

interface UserContentTabsProps {
  posts: Post[]
  savedPosts?: Post[]
  user: User
}

export default function UserContentTabs({
  posts,
  savedPosts,
  user,
}: UserContentTabsProps) {
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts')

  return (
    <div>
      <Divider activeTab={activeTab} setActiveTab={setActiveTab} />
      <div>
        {activeTab === 'posts' && <UserPosts posts={posts} user={user} />}
        {activeTab === 'saved' && (
          <UserPosts posts={savedPosts ?? []} user={user} />
        )}
      </div>
    </div>
  )
}
