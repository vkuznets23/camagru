import React, { useState } from 'react'
import Divider from '@/components/posts/Divider'
import UserPosts from '@/components/posts/Posts'
import { useUser } from '@/context/userContext'

export default function UserContentTabs() {
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts')
  const { user } = useUser()
  if (!user) return null

  return (
    <div>
      <Divider activeTab={activeTab} setActiveTab={setActiveTab} />
      <div>
        {activeTab === 'posts' && <UserPosts />}
        {activeTab === 'saved' && (
          <p
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '120px',
            }}
          >
            Saved posts will go here
          </p>
        )}
        {/* {activeTab === 'saved' && <SavedPosts posts={savedPosts ?? []} />} */}
      </div>
    </div>
  )
}
