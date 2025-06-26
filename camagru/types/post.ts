import { type Comment } from '@/types/comment'
import { type User } from '@/types/user'

export type Post = {
  id: string
  image: string
  content: string
  createdAt: string
  user: User
  comments: Comment[]
  likedByCurrentUser: boolean
  likesCount: number
}
