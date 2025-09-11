"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentFactory = commentFactory;
const faker_1 = require("@faker-js/faker");
// model Comment {
//   id        String   @id @default(cuid())
//   content   String
//   createdAt DateTime @default(now())
//   postId    String
//   userId    String
//   post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
//   user      User     @relation(fields: [userId], references: [id])
// }
function commentFactory(userId, postId) {
    return {
        content: faker_1.faker.lorem.sentence(),
        userId,
        postId,
        createdAt: new Date(),
    };
}
