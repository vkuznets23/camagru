export type Post = {
  id: string
  image: string
  content: string
  createdAt: string
  user: {
    username: string
    name?: string
    image?: string
  }
  comments: {
    id: string
    content: string
    createdAt: string
    user: {
      username: string
      image?: string
    }
  }[]
}
