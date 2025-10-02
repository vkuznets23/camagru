import { createCaptionContext } from './captionContext'

export interface CaptionStrategy {
  generate(category: string): string
}

// Factory function that uses Strategy Pattern
export function createPostWithCaption(
  category: string,
  strategyType: 'faker' | 'template' | 'quote'
) {
  const context = createCaptionContext(strategyType)
  const caption = context.generateCaption(category)

  return {
    content: caption,
    strategy: context.getCurrentStrategy(),
  }
}

// Legacy function for backward compatibility
export async function postFactory(strategy: CaptionStrategy, category: string) {
  const caption = strategy.generate(category)
  return {
    content: caption,
  }
}
