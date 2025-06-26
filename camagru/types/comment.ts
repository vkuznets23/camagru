export type Comment = {
  id: string
  content: string
  createdAt: string
  postId: string
  user: {
    username: string
    image?: string
  }
}
