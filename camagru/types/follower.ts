import { type User } from '@/types/user'

export interface Follower {
  id: string
  followerId: string
  followingId: string
  follower: User
  following: User
}
