"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakerStrategy = void 0;
const faker_1 = require("@faker-js/faker");
class FakerStrategy {
    generate(category) {
        const emojis = {
            people: ['😍', '✨', '💪', '🌿', '😎'],
            food: ['🍕', '🍣'],
            nature: ['🌸', '🌿', '😎'],
            animals: ['🐶', '🐱', '🐭'],
            city: ['🏙️', '🌆', '🌃'],
            studying: ['📚', '📝', '📝'],
        };
        const emoji = emojis[category][Math.floor(Math.random() * emojis[category].length)];
        return `${faker_1.faker.lorem.sentence()} ${emoji}`;
    }
}
exports.FakerStrategy = FakerStrategy;
