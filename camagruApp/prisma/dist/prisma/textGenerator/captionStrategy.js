"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostWithCaption = createPostWithCaption;
exports.postFactory = postFactory;
const captionContext_1 = require("./captionContext");
// Factory function that uses Strategy Pattern
function createPostWithCaption(category, strategyType) {
    const context = (0, captionContext_1.createCaptionContext)(strategyType);
    const caption = context.generateCaption(category);
    return {
        content: caption,
        strategy: context.getCurrentStrategy(),
    };
}
// Legacy function for backward compatibility
async function postFactory(strategy, category) {
    const caption = strategy.generate(category);
    return {
        content: caption,
    };
}
