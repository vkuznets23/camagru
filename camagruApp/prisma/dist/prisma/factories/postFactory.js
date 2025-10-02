"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlurDataURL = getBlurDataURL;
exports.fetchUnsplashImage = fetchUnsplashImage;
exports.postFactory = postFactory;
const captionContext_1 = require("../textGenerator/captionContext");
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
    // Fallback to unique placeholder images if no API key
    if (!ACCESS_KEY) {
        // Use a hash of the query to get consistent images
        const hash = query.split('').reduce((a, b) => {
            a = (a << 5) - a + b.charCodeAt(0);
            return a & a;
        }, 0);
        const imageId = (Math.abs(hash) % 1000) + 1;
        return {
            full: `https://picsum.photos/id/${imageId}/800/800`,
            thumb: `https://picsum.photos/id/${imageId}/200/200`,
        };
    }
    try {
        // Extract base category from unique query
        const baseCategory = query.split('-')[0];
        // Map categories to more specific Unsplash queries
        const categoryQueries = {
            people: 'portrait,person,face,selfie',
            food: 'food,meal,dish,restaurant',
            nature: 'landscape,nature,forest,mountain',
            animals: 'animal,pet,dog,cat,wildlife',
            city: 'city,urban,architecture,building',
            studying: 'study,books,education,learning',
        };
        const searchQuery = categoryQueries[baseCategory] ||
            baseCategory;
        const response = await (0, node_fetch_1.default)(`https://api.unsplash.com/photos/random?query=${searchQuery}&client_id=${ACCESS_KEY}&count=1&w=800&h=800&fit=crop`);
        if (!response.ok)
            throw new Error(`Unsplash API error: ${response.status}`);
        const data = await response.json();
        // Unsplash returns an array, so we need to get the first element
        const photo = Array.isArray(data) ? data[0] : data;
        if (!photo || !photo.urls) {
            throw new Error('Invalid response from Unsplash API');
        }
        return {
            full: photo.urls.full,
            thumb: photo.urls.thumb,
        };
    }
    catch (error) {
        console.warn(`Unsplash API failed, using unique placeholder: ${error}`);
        // Use a hash of the query to get consistent images
        const hash = query.split('').reduce((a, b) => {
            a = (a << 5) - a + b.charCodeAt(0);
            return a & a;
        }, 0);
        const imageId = (Math.abs(hash) % 1000) + 1;
        return {
            full: `https://picsum.photos/id/${imageId}/800/800`,
            thumb: `https://picsum.photos/id/${imageId}/200/200`,
        };
    }
}
async function postFactory(userId) {
    const categories = ['nature', 'people', 'animals', 'city', 'food', 'studying'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    // Create caption context with specified strategy or random
    const captionStrategy = (0, captionContext_1.getRandomStrategyType)();
    const captionContext = (0, captionContext_1.createCaptionContext)(captionStrategy);
    // Generate caption using Strategy Pattern
    const caption = captionContext.generateCaption(randomCategory);
    // Fetch unique image for each post (no caching)
    // Create a stable unique query based on category and user
    const uniqueQuery = `${randomCategory}-${userId}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
    const image = await fetchUnsplashImage(uniqueQuery);
    const blurDataURL = await getBlurDataURL(image.full);
    const imageData = { full: image.full, blurDataURL };
    return {
        content: caption,
        image: imageData.full,
        blurDataURL: imageData.blurDataURL,
        userId,
        createdAt: new Date(),
    };
}
