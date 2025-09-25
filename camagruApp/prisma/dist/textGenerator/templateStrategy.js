"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateStrategy = void 0;
exports.getRandomCaption = getRandomCaption;
exports.getMixedCaption = getMixedCaption;
const captionCorpus_1 = require("./captionCorpus");
// Function to get random caption from category
function getRandomCaption(category, useLong = false) {
    const categoryData = captionCorpus_1.captionsByCategory[category];
    if (!categoryData) {
        // Fallback to people category
        const fallback = captionCorpus_1.captionsByCategory.people;
        const captions = useLong ? fallback.long : fallback.short;
        return captions[Math.floor(Math.random() * captions.length)];
    }
    const captions = useLong ? categoryData.long : categoryData.short;
    return captions[Math.floor(Math.random() * captions.length)];
}
// Function to get mixed length captions
function getMixedCaption(category) {
    const useLong = Math.random() < 0.3;
    return getRandomCaption(category, useLong);
}
class TemplateStrategy {
    generate(category) {
        return getMixedCaption(category);
    }
}
exports.TemplateStrategy = TemplateStrategy;
