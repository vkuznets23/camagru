"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaptionContext = void 0;
exports.createCaptionContext = createCaptionContext;
exports.getRandomStrategyType = getRandomStrategyType;
const fakerStrategy_1 = require("./fakerStrategy");
const templateStrategy_1 = require("./templateStrategy");
class CaptionContext {
    strategy;
    strategyType;
    constructor(strategyType = 'template') {
        this.strategyType = strategyType;
        this.strategy = this.createStrategy(strategyType);
    }
    createStrategy(strategyType) {
        switch (strategyType) {
            case 'faker':
                return new fakerStrategy_1.FakerStrategy();
            case 'template':
                return new templateStrategy_1.TemplateStrategy();
            default:
                console.warn(`Unknown strategy type: ${strategyType}, falling back to template`);
                return new templateStrategy_1.TemplateStrategy();
        }
    }
    // Set a new strategy at runtime
    setStrategy(strategyType) {
        this.strategyType = strategyType;
        this.strategy = this.createStrategy(strategyType);
        console.log(`📝 Caption strategy changed to: ${strategyType}`);
    }
    // Generate caption using current strategy
    generateCaption(category) {
        try {
            return this.strategy.generate(category);
        }
        catch (error) {
            console.warn(`Caption generation failed with ${this.strategyType}:`, error instanceof Error ? error.message : 'Unknown error');
            // Fallback to a simple caption
            return `Amazing ${category} content! ✨`;
        }
    }
    // Get current strategy info
    getCurrentStrategy() {
        return this.strategyType;
    }
    // Get available strategy types
    static getAvailableStrategies() {
        return ['faker', 'template'];
    }
    // Get strategy description
    static getStrategyDescription(strategyType) {
        const descriptions = {
            faker: 'Uses faker.js to generate random Lorem ipsum text with category-specific emojis',
            template: 'Uses our curated Instagram-style caption corpus with Markov chain generation',
        };
        return descriptions[strategyType] || 'Unknown strategy';
    }
}
exports.CaptionContext = CaptionContext;
// Factory function for easy creation
function createCaptionContext(strategyType = 'template') {
    return new CaptionContext(strategyType);
}
// Utility function to get random strategy
function getRandomStrategyType() {
    const strategies = CaptionContext.getAvailableStrategies();
    return strategies[Math.floor(Math.random() * strategies.length)];
}
