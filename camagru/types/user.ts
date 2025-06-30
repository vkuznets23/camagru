import { Post } from '@/types/post'
import { type Follower } from '@/types/follower'

export type User = {
  id: string
  name: string
  username: string
  bio?: string
  image?: string
  posts: Post[]
  _count: {
    posts: number
    followers: number
    following: number
  }
  followers: Follower[]
  following: Follower[]
  savedPosts: Post[]
}
