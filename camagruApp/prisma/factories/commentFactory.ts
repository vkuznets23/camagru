import { faker } from '@faker-js/faker'

// model Comment {
//   id        String   @id @default(cuid())
//   content   String
//   createdAt DateTime @default(now())
//   postId    String
//   userId    String
//   post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
//   user      User     @relation(fields: [userId], references: [id])
// }

export function commentFactory(userId: string, postId: string) {
  return {
    content: faker.lorem.sentence(),
    userId,
    postId,
    createdAt: new Date(),
  }
}
