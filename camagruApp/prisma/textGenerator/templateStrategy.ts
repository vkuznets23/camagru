import { captionsByCategory } from './captionCorpus'
import { CaptionStrategy } from './captionStrategy'

// Function to get random caption from category
export function getRandomCaption(category: string, useLong = false): string {
  const categoryData =
    captionsByCategory[category as keyof typeof captionsByCategory]
  if (!categoryData) {
    // Fallback to people category
    const fallback = captionsByCategory.people
    const captions = useLong ? fallback.long : fallback.short
    return captions[Math.floor(Math.random() * captions.length)]
  }

  const captions = useLong ? categoryData.long : categoryData.short
  return captions[Math.floor(Math.random() * captions.length)]
}

// Function to get mixed length captions
export function getMixedCaption(category: string): string {
  const useLong = Math.random() < 0.5
  return getRandomCaption(category, useLong)
}

export class TemplateStrategy implements CaptionStrategy {
  generate(category: string): string {
    return getMixedCaption(category)
  }
}
