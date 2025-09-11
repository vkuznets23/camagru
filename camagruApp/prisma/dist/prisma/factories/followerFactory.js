"use strict";
// model Follower {
//   id          String @id @default(cuid())
//   followerId  String
//   followingId String
//   follower    User   @relation("UserFollowing", fields: [followerId], references: [id])
//   following   User   @relation("UserFollowers", fields: [followingId], references: [id])
Object.defineProperty(exports, "__esModule", { value: true });
exports.followerFactory = followerFactory;
//   @@unique([followerId, followingId])
// }
function followerFactory(followerId, followingId) {
    return {
        followerId,
        followingId,
    };
}
