"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCaption = generateCaption;
const openai_1 = __importDefault(require("openai"));
const ACCESS_KEY = process.env.OPENAI_API_KEY;
console.log('ACCESS_KEY', ACCESS_KEY);
// Only initialize OpenAI if API key is available
const client = ACCESS_KEY
    ? new openai_1.default({
        apiKey: ACCESS_KEY,
    })
    : null;
async function generateCaption(category) {
    // Return early if no API key
    if (!client) {
        console.warn('OPENAI_API_KEY not found, using fallback captions');
        return getFallbackCaption(category);
    }
    const prompts = {
        people: [
            'Write a short Instagram caption for a selfie or portrait photo. Include emojis and make it personal and engaging.',
            'Create an Instagram caption for a photo of people. Make it fun, relatable, and include relevant emojis.',
            'Write a casual Instagram caption for a people photo. Keep it short, authentic, and add some emojis.',
        ],
        food: [
            'Write an Instagram caption for a food photo. Make it appetizing and include food-related emojis.',
            'Create a caption for a delicious meal photo. Make it mouth-watering and fun with emojis.',
            'Write a foodie Instagram caption. Keep it short, tasty, and include food emojis.',
        ],
        nature: [
            'Write an Instagram caption for a nature photo. Make it peaceful and include nature emojis.',
            'Create a caption for a beautiful landscape or nature scene. Make it serene and add nature emojis.',
            'Write a nature Instagram caption. Keep it calm, inspiring, and include nature emojis.',
        ],
        animals: [
            'Write an Instagram caption for an animal photo. Make it cute and include animal emojis.',
            'Create a caption for a pet or wildlife photo. Make it adorable and add animal emojis.',
            'Write an animal Instagram caption. Keep it sweet, fun, and include animal emojis.',
        ],
        city: [
            'Write an Instagram caption for a city photo. Make it urban and include city-related emojis.',
            'Create a caption for an urban landscape photo. Make it dynamic and add city emojis.',
            'Write a city Instagram caption. Keep it energetic, modern, and include city emojis.',
        ],
        studying: [
            'Write an Instagram caption for a study/work photo. Make it motivational and include study emojis.',
            'Create a caption for a productivity or learning photo. Make it inspiring and add study emojis.',
            'Write a study Instagram caption. Keep it focused, encouraging, and include study emojis.',
        ],
    };
    const categoryPrompts = prompts[category] || prompts.people;
    const randomPrompt = categoryPrompts[Math.floor(Math.random() * categoryPrompts.length)];
    try {
        const response = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: randomPrompt }],
            max_tokens: 100,
            temperature: 0.8,
        });
        return response.choices[0].message?.content?.trim() || '';
    }
    catch (error) {
        console.warn(`OpenAI API error: ${error}`);
        return getFallbackCaption(category);
    }
}
// Fallback captions when AI is not available
function getFallbackCaption(category) {
    const fallbackCaptions = {
        people: [
            'Living my best life ✨',
            'Good vibes only 💫',
            'Selfie Sunday 📸',
            'Feeling blessed 🙏',
            'New hair, who dis? 💇‍♀️',
            'Coffee and confidence ☕️',
            'Weekend mood 🎉',
            'Golden hour magic ✨',
            'Just being me 💕',
            'Adventure awaits 🌟',
        ],
        food: [
            'Food coma incoming 🍕',
            "Chef's kiss 👨‍🍳💋",
            'This hits different 😋',
            'Foodie life 🍽️',
            'Brunch goals 🥐',
            'Homemade with love ❤️',
            'Taste the rainbow 🌈',
            'Food photography 📸',
            'Dinner date vibes 🍷',
            'Sweet tooth satisfied 🍰',
        ],
        nature: [
            'Nature vibes 🌿',
            'Peaceful ✨',
            'Green therapy 🌱',
            'Forest bathing 🌲',
            'Mountain therapy ⛰️',
            'Ocean therapy 🌊',
            'Sunset meditation 🌅',
            'Earth connection 🌍',
        ],
        animals: [
            'Cutest little buddy 🐾',
            'Puppy love 💕',
            'Wildlife Wednesday 🦋',
            'Furry friend 🐱',
            'Adventure buddy 🐕',
            "Nature's beauty 🦅",
            'Sweet moments 🐰',
            'Animal magic ✨',
        ],
        city: [
            'City lights 🌃',
            'Urban vibes 🏙️',
            'Concrete jungle 🌆',
            'City explorer 🚶‍♀️',
            'Metropolitan life 🏢',
            'Street art 🎨',
            'City hustle 💼',
            'Urban adventure 🚇',
        ],
        studying: [
            'Study mode ON 📚',
            'Knowledge is power 💡',
            'Learning never stops 🧠',
            'Productivity vibes ✍️',
            'Coffee and books ☕️',
            'Student life 📖',
            'Focus time 🎯',
            'Growth mindset 🌱',
        ],
    };
    const categoryCaptions = fallbackCaptions[category] ||
        fallbackCaptions.people;
    return categoryCaptions[Math.floor(Math.random() * categoryCaptions.length)];
}
