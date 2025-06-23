export type Comment = {
  id: string
  content: string
  createdAt: string
  user: {
    username: string
    image?: string
  }
}
