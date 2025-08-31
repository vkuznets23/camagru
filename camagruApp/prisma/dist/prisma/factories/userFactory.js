"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFactory = userFactory;
const faker_1 = require("@faker-js/faker");
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
function userFactory() {
    return {
        email: faker_1.faker.internet.email(),
        username: faker_1.faker.internet.username(),
        password: 'hashedpassword123',
        name: faker_1.faker.person.fullName(),
        bio: faker_1.faker.lorem.sentence(),
        image: faker_1.faker.image.avatar(),
        createdAt: new Date(),
        emailVerified: new Date(),
    };
}
