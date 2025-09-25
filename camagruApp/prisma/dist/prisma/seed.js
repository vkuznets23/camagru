"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../utils/prisma");
const userFactory_1 = require("./factories/userFactory");
const postFactory_1 = require("./factories/postFactory");
const likeFactory_1 = require("./factories/likeFactory");
const followerFactory_1 = require("./factories/followerFactory");
const commentFactory_1 = require("./factories/commentFactory");
async function main() {
    console.log('Start seeding...');
    const numberOfUsers = 3;
    const users = [];
    // create users
    for (let i = 0; i < numberOfUsers; i++) {
        const userData = (0, userFactory_1.userFactory)();
        const user = await prisma_1.prisma.user.create({ data: userData });
        users.push(user);
        console.log(`Created user: ${user.username}`);
    }
    // create post
    const posts = [];
    for (const user of users) {
        const numPosts = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numPosts; i++) {
            const postData = await (0, postFactory_1.postFactory)(user.id);
            const post = await prisma_1.prisma.post.create({ data: postData });
            posts.push(post);
            console.log(`Created post by ${user.username}`);
        }
    }
    // add comments
    for (const post of posts) {
        const numComments = Math.floor(Math.random() * 4);
        for (let i = 0; i < numComments; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const commentData = (0, commentFactory_1.commentFactory)(randomUser.id, post.id);
            await prisma_1.prisma.comment.create({ data: commentData });
            console.log(`Created comment on post ${post.id} by ${randomUser.username}`);
        }
    }
    // add likes
    for (const post of posts) {
        const shuffledUsers = users.sort(() => 0.5 - Math.random());
        const numLikes = Math.floor(Math.random() * users.length);
        for (let i = 0; i < numLikes; i++) {
            const likeData = (0, likeFactory_1.likeFactory)(post.id, shuffledUsers[i].id);
            try {
                await prisma_1.prisma.like.create({ data: likeData });
            }
            catch (err) {
                // на случай дубликатов
                console.log(err);
            }
        }
    }
    // create followers
    for (const user of users) {
        const shuffledUsers = users
            .filter((u) => u.id !== user.id)
            .sort(() => 0.5 - Math.random());
        const numFollowing = Math.floor(Math.random() * (users.length - 1));
        for (let i = 0; i < numFollowing; i++) {
            const followData = (0, followerFactory_1.followerFactory)(user.id, shuffledUsers[i].id);
            try {
                await prisma_1.prisma.follower.create({ data: followData });
            }
            catch (err) {
                console.log(err);
            }
        }
    }
    console.log('✅ Seeding done');
}
main()
    .catch((e) => console.error(e))
    .finally(async () => {
    await prisma_1.prisma.$disconnect();
});
