// model Follower {
//   id          String @id @default(cuid())
//   followerId  String
//   followingId String
//   follower    User   @relation("UserFollowing", fields: [followerId], references: [id])
//   following   User   @relation("UserFollowers", fields: [followingId], references: [id])

//   @@unique([followerId, followingId])
// }
export function followerFactory(followerId: string, followingId: string) {
  return {
    followerId,
    followingId,
  }
}
