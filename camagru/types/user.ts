import { Post } from '@/types/post'

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
  savedPosts: Post[]
}
