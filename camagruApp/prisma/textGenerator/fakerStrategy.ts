import { faker } from '@faker-js/faker'
import { CaptionStrategy } from './captionStrategy'

export class FakerStrategy implements CaptionStrategy {
  generate(category: string): string {
    const emojis = {
      people: ['😍', '✨', '💪', '🌿', '😎'],
      food: ['🍕', '🍣'],
      nature: ['🌸', '🌿', '😎'],
      animals: ['🐶', '🐱', '🐭'],
      city: ['🏙️', '🌆', '🌃'],
      studying: ['📚', '📝', '📝'],
    }
    const emoji =
      emojis[category as keyof typeof emojis][
        Math.floor(
          Math.random() * emojis[category as keyof typeof emojis].length
        )
      ]
    return `${faker.lorem.sentence()} ${emoji}`
  }
}
