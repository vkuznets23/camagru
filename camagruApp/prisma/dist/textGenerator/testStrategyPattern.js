"use strict";
// Test file for Strategy Pattern implementation
Object.defineProperty(exports, "__esModule", { value: true });
const captionContext_1 = require("./captionContext");
function testStrategyPattern() {
    console.log('🎯 Testing Strategy Pattern for Caption Generation\n');
    const categories = ['people', 'food', 'nature', 'animals', 'city', 'studying'];
    const strategies = ['faker', 'template'];
    // Test each strategy
    for (const strategyType of strategies) {
        console.log(`📝 Testing ${strategyType.toUpperCase()} Strategy:`);
        console.log(`   Description: ${captionContext_1.CaptionContext.getStrategyDescription(strategyType)}`);
        const context = (0, captionContext_1.createCaptionContext)(strategyType);
        // Test with different categories
        for (const category of categories.slice(0, 3)) {
            // Test first 3 categories
            const caption = context.generateCaption(category);
            console.log(`   ${category}: ${caption}`);
        }
        console.log('');
    }
    // Test strategy switching
    console.log('🔄 Testing Strategy Switching:');
    const context = (0, captionContext_1.createCaptionContext)('template');
    console.log(`   Initial strategy: ${context.getCurrentStrategy()}`);
    context.setStrategy('faker');
    const caption1 = context.generateCaption('food');
    console.log(`   Faker caption: ${caption1}`);
    context.setStrategy('template');
    const caption2 = context.generateCaption('nature');
    console.log(`   Template caption: ${caption2}`);
    // Test random strategy selection
    console.log('\n🎲 Testing Random Strategy Selection:');
    const randomStrategy = (0, captionContext_1.getRandomStrategyType)();
    const randomContext = (0, captionContext_1.createCaptionContext)(randomStrategy);
    const randomCaption = randomContext.generateCaption('people');
    console.log(`   Random strategy (${randomStrategy}): ${randomCaption}`);
    console.log('\n✅ Strategy Pattern test completed!');
}
// Run the test
testStrategyPattern();
