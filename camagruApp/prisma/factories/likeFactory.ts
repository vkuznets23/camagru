// model Like {
//   id        String   @id @default(cuid())
//   userId    String
//   postId    String
//   createdAt DateTime @default(now())
//   post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
//   user      User     @relation(fields: [userId], references: [id])

//   @@unique([userId, postId])
// }

export function likeFactory(postId: string, userId: string) {
  return {
    postId,
    userId,
    createdAt: new Date(),
  }
}
