import { type Comment } from '@/types/comment'
import { type User } from '@/types/user'

export type Post = {
  id: string
  image: string
  content: string
  createdAt: string
  userId?: string
  user: User
  comments: Comment[]
  likedByCurrentUser: boolean
  savedByCurrentUser: boolean
  savedBy?: User[]
  likesCount: number
  commentsCount?: number
  blurDataURL?: string
}
