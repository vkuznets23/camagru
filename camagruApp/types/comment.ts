import { User } from '@/types/user'

export type Comment = {
  id: string
  content: string
  createdAt: string
  postId: string
  user: User
}
