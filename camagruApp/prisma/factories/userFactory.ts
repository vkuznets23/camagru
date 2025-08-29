import { faker } from '@faker-js/faker'

// model User {
//   id                      String                   @id @default(cuid())
//   email                   String                   @unique
//   emailVerified           DateTime?
//   image                   String?
//   password                String
//   username                String                   @unique
//   resetToken              String?
//   resetTokenExpiry        DateTime?
//   bio                     String?
//   name                    String?
//   createdAt               DateTime?                @default(now())
//   updatedAt               DateTime?                @updatedAt
//   comments                Comment[]
//   emailVerificationTokens EmailVerificationToken[]
//   following               Follower[]               @relation("UserFollowing")
//   followers               Follower[]               @relation("UserFollowers")
//   likedPosts              Like[]
//   posts                   Post[]                   @relation("UserPosts")
//   sessions                Session[]
//   savedPosts              Post[]                   @relation("SavedPosts")
// }

export function userFactory() {
  return {
    email: faker.internet.email(),
    username: faker.internet.username(),
    password: 'hashedpassword123',
    name: faker.person.fullName(),
    bio: faker.lorem.sentence(),
    image: faker.image.avatar(),
    createdAt: new Date(),
  }
}
