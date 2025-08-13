import React, { useState } from 'react'
import Divider from '@/components/posts/Divider'
import { type Post } from '@/types/post'
import UserPosts from '@/components/posts/Posts'

interface UserContentTabsProps {
  posts: Post[]
  savedPosts?: Post[]
}

export default function UserContentTabs({
  posts,
  savedPosts,
}: UserContentTabsProps) {
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts')
  return (
    <div>
      <Divider activeTab={activeTab} setActiveTab={setActiveTab} />
      <div>
        {activeTab === 'posts' && <UserPosts posts={posts} />}
        {activeTab === 'saved' && <UserPosts posts={savedPosts ?? []} />}
      </div>
    </div>
  )
}
