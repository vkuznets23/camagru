export type User = {
  id: string
  name: string
  username: string
  bio?: string
  image?: string
  posts: {
    id: string
    content: string
    image: string
    createdAt: string
  }[]
  _count: {
    posts: number
    followers: number
    following: number
  }
}
