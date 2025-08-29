"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postFactory = postFactory;
const blurImage_1 = require("../../utils/blurImage");
const faker_1 = require("@faker-js/faker");
// model Post {
//   id        String    @id @default(cuid())
//   content   String?
//   image     String
//   userId    String
//   createdAt DateTime  @default(now())
//   blurDataURL String?
//   comments  Comment[]
//   likedBy   Like[]
//   user      User      @relation("UserPosts", fields: [userId], references: [id])
//   savedBy   User[]    @relation("SavedPosts")
// }
async function postFactory(userId) {
    const image = faker_1.faker.image.urlPicsumPhotos({ width: 400, height: 400 });
    const blurDataURL = await (0, blurImage_1.getBlurDataURL)(image);
    return {
        content: faker_1.faker.lorem.paragraph(),
        image,
        blurDataURL,
        userId,
        createdAt: new Date(),
    };
}
