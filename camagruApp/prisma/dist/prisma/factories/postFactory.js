"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlurDataURL = getBlurDataURL;
exports.postFactory = postFactory;
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
const sharp_1 = __importDefault(require("sharp"));
const node_fetch_1 = __importDefault(require("node-fetch"));
async function getBlurDataURL(imageUrl) {
    const response = await (0, node_fetch_1.default)(imageUrl, { redirect: 'follow' });
    if (!response.ok)
        throw new Error(`Failed to fetch image: ${response.status}`);
    const contentType = response.headers.get('content-type');
    if (!contentType?.startsWith('image/')) {
        throw new Error(`URL did not return an image. Got: ${contentType}`);
    }
    const buffer = await response.buffer();
    const resized = await (0, sharp_1.default)(buffer)
        .resize(10, 10)
        .blur()
        .jpeg({ quality: 50 })
        .toBuffer();
    const base64 = resized.toString('base64');
    return `data:image/jpeg;base64,${base64}`;
}
const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
async function fetchUnsplashImage(query) {
    const response = await (0, node_fetch_1.default)(`https://api.unsplash.com/photos/random?query=${query}&client_id=${ACCESS_KEY}`);
    if (!response.ok)
        throw new Error(`Unsplash API error: ${response.status}`);
    const data = await response.json();
    return {
        full: data.urls.full,
        thumb: data.urls.thumb,
    };
}
const postImageCache = {};
async function postFactory(userId) {
    const categories = ['nature', 'people', 'animals', 'city'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    let imageData = postImageCache[randomCategory];
    if (!imageData) {
        const image = await fetchUnsplashImage(randomCategory);
        const blurDataURL = await getBlurDataURL(image.full);
        imageData = { full: image.full, blurDataURL };
        postImageCache[randomCategory] = imageData;
    }
    return {
        content: faker_1.faker.lorem.paragraph(),
        image: imageData.full,
        blurDataURL: imageData.blurDataURL,
        userId,
        createdAt: new Date(),
    };
}
