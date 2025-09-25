import { CaptionStrategy } from './captionStrategy'
import { FakerStrategy } from './fakerStrategy'
import { QuoteStrategy } from './quoteStrategy'
import { TemplateStrategy } from './templateStrategy'

export type StrategyType = 'faker' | 'template' | 'quote'

export class CaptionContext {
  private strategy: CaptionStrategy
  private strategyType: StrategyType

  constructor(strategyType: StrategyType = 'template') {
    this.strategyType = strategyType
    this.strategy = this.createStrategy(strategyType)
  }

  private createStrategy(strategyType: StrategyType): CaptionStrategy {
    switch (strategyType) {
      case 'faker':
        return new FakerStrategy()
      case 'template':
        return new TemplateStrategy()
      case 'quote':
        return new QuoteStrategy()
      default:
        console.warn(
          `Unknown strategy type: ${strategyType}, falling back to template`
        )
        return new TemplateStrategy()
    }
  }

  // Set a new strategy at runtime
  setStrategy(strategyType: StrategyType): void {
    this.strategyType = strategyType
    this.strategy = this.createStrategy(strategyType)
    console.log(`📝 Caption strategy changed to: ${strategyType}`)
  }

  // Generate caption using current strategy
  generateCaption(category: string): string {
    try {
      return this.strategy.generate(category)
    } catch (error) {
      console.warn(
        `Caption generation failed with ${this.strategyType}:`,
        error instanceof Error ? error.message : 'Unknown error'
      )
      // Fallback to a simple caption
      return `Amazing ${category} content! ✨`
    }
  }

  // Get current strategy info
  getCurrentStrategy(): StrategyType {
    return this.strategyType
  }

  // Get available strategy types
  static getAvailableStrategies(): StrategyType[] {
    return ['faker', 'template', 'quote']
  }

  // Get strategy description
  static getStrategyDescription(strategyType: StrategyType): string {
    const descriptions = {
      faker:
        'Uses faker.js to generate random Lorem ipsum text with category-specific emojis',
      template:
        'Uses our curated Instagram-style caption corpus with Markov chain generation',
      quote: 'Uses inspirational quotes and sayings for each category',
    }
    return descriptions[strategyType] || 'Unknown strategy'
  }
}

// Factory function for easy creation
export function createCaptionContext(
  strategyType: StrategyType
): CaptionContext {
  return new CaptionContext(strategyType)
}

// Utility function to get random strategy
export function getRandomStrategyType(): StrategyType {
  const strategies = CaptionContext.getAvailableStrategies()
  return strategies[Math.floor(Math.random() * strategies.length)]
}
