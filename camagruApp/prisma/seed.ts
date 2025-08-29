import { Post } from '@prisma/client'
import { prisma } from '../utils/prisma'
import { userFactory } from './factories/userFactory'
import { postFactory } from './factories/postFactory'
import { likeFactory } from './factories/likeFactory'
import { followerFactory } from './factories/followerFactory'
import { commentFactory } from './factories/commentFactory'

async function main() {
  console.log('Start seeding...')

  const numberOfUsers = 5
  const users = []

  // create users
  for (let i = 0; i < numberOfUsers; i++) {
    const userData = userFactory()
    const user = await prisma.user.create({ data: userData })
    users.push(user)
    console.log(`Created user: ${user.username}`)
  }

  // create post
  const posts: Post[] = []
  for (const user of users) {
    const numPosts = Math.floor(Math.random() * 3) + 1
    for (let i = 0; i < numPosts; i++) {
      const postData = await postFactory(user.id)
      const post = await prisma.post.create({ data: postData })
      posts.push(post)
      console.log(`Created post by ${user.username}`)
    }
  }

  // add comments
  for (const post of posts) {
    const numComments = Math.floor(Math.random() * 4)
    for (let i = 0; i < numComments; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)]
      const commentData = commentFactory(randomUser.id, post.id)
      await prisma.comment.create({ data: commentData })
      console.log(
        `Created comment on post ${post.id} by ${randomUser.username}`
      )
    }
  }

  // add likes
  for (const post of posts) {
    const shuffledUsers = users.sort(() => 0.5 - Math.random())
    const numLikes = Math.floor(Math.random() * users.length)
    for (let i = 0; i < numLikes; i++) {
      const likeData = likeFactory(post.id, shuffledUsers[i].id)
      try {
        await prisma.like.create({ data: likeData })
      } catch (err) {
        // на случай дубликатов
        console.log(err)
      }
    }
  }

  // create followers
  for (const user of users) {
    const shuffledUsers = users
      .filter((u) => u.id !== user.id)
      .sort(() => 0.5 - Math.random())
    const numFollowing = Math.floor(Math.random() * (users.length - 1))
    for (let i = 0; i < numFollowing; i++) {
      const followData = followerFactory(user.id, shuffledUsers[i].id)
      try {
        await prisma.follower.create({ data: followData })
      } catch (err) {
        console.log(err)
      }
    }
  }

  console.log('✅ Seeding done')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })

// async function main() {
//   console.log('Start seeding...')

//   const users = [
//     {
//       email: 'alice@test.com',
//       username: 'alice',
//       password: 'hashedpassword123',
//     },
//     { email: 'bob@test.com', username: 'bob', password: 'hashedpassword123' },
//     {
//       email: 'carol@test.com',
//       username: 'carol',
//       password: 'hashedpassword123',
//     },
//   ]

//   for (const userData of users) {
//     const user = await prisma.user.create({
//       data: userData,
//     })
//     console.log('Created user:', user.username)
//   }
// }

// main()
//   .then(() => {
//     console.log('✅ Seeding done')
//   })
//   .catch((e) => {
//     console.error(e)
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })
