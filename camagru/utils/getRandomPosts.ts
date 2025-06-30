import { type Post } from '@/types/post'

export function GetRandomPosts(posts: Post[], count: number): Post[] {
  function getRandomElements<T>(arr: T[], n: number): T[] {
    const result: T[] = []
    const usedIndices = new Set<number>()

    while (result.length < n && result.length < arr.length) {
      const randomIndex = Math.floor(Math.random() * arr.length)
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex)
        result.push(arr[randomIndex])
      }
    }
    return result
  }

  return getRandomElements(posts, count)
}
