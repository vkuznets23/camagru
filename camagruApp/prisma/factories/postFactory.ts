import { getBlurDataURL } from '../../utils/blurImage'
import { faker } from '@faker-js/faker'

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

export async function postFactory(userId: string) {
  const image = faker.image.urlPicsumPhotos({ width: 400, height: 400 })
  const blurDataURL = await getBlurDataURL(image)

  return {
    content: faker.lorem.paragraph(),
    image,
    blurDataURL,
    userId,
    createdAt: new Date(),
  }
}
