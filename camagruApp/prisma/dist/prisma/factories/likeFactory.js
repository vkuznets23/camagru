"use strict";
// model Like {
//   id        String   @id @default(cuid())
//   userId    String
//   postId    String
//   createdAt DateTime @default(now())
//   post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
//   user      User     @relation(fields: [userId], references: [id])
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeFactory = likeFactory;
//   @@unique([userId, postId])
// }
function likeFactory(postId, userId) {
    return {
        postId,
        userId,
        createdAt: new Date(),
    };
}
