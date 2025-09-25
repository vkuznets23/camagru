import { CaptionStrategy } from './captionStrategy'

export class QuoteStrategy implements CaptionStrategy {
  generate(category: string): string {
    const quotes = {
      people: [
        'Be yourself; everyone else is already taken. - Oscar Wilde',
        'You are enough. ✨',
        'The only way to do great work is to love what you do. - Steve Jobs',
        'The best way to predict the future is to invent it. - Alan Kay',
        'Do what you can, with what you have, where you are. - Theodore Roosevelt',
        'Happiness is not something ready made. It comes from your own actions. - Dalai Lama',
        'Believe you can and you’re halfway there. - Theodore Roosevelt',
        'Dream big and dare to fail. - Norman Vaughan',
        'In a world where you can be anything, be kind.',
        'Collect moments, not things. 🌟',
      ],
      nature: [
        'In every walk with nature, one receives far more than they seek',
        'The earth has music for those who listen. - William Shakespeare',
        'Look deep into nature, and then you will understand everything better. - Albert Einstein',
        'Adopt the pace of nature: her secret is patience. - Ralph Waldo Emerson',
        'Nature always wears the colors of the spirit. - Ralph Waldo Emerson',
      ],
      food: [
        'People who love to eat are always the best people. - Julia Child',
        'Life is too short to eat bad food. - Francis Bacon',
        'Food is love. - Jamie Oliver',
        'I love food. I love food. I love food. - Anthony Bourdain',
        'Food is the way to a man’s heart. - Johnathon Swift',
        'I love food. I love food. I love food. - Anthony Bourdain',
      ],
      animals: [
        'The greatness of a nation can be judged by the way its animals are treated. - Mahatma Gandhi',
        'Until one has loved an animal, a part of one’s soul remains unawakened. - Anatole France',
        'Pets understand humans better than humans do. 🐾',
        'Animals are such agreeable friends—they ask no questions; they pass no criticisms. - George Eliot',
      ],
      city: [
        'The city never sleeps, and neither do our dreams. 🌆',
        'Concrete jungle where dreams are made of. - Alicia Keys',
      ],
      studying: [
        'Study hard, dream big. 📚',
        'The beautiful thing about learning is that no one can take it away from you. - B.B. King',
        'Focus on your goals, the rest is just noise. ✏️',
        'Work hard in silence, let success make the noise. 💡',
        'Don’t watch the clock; do what it does. Keep going. - Sam Levenson',
        'Learning never exhausts the mind. - Leonardo da Vinci',
        'Books are uniquely portable magic. - Stephen King',
      ],
    }
    return quotes[category as keyof typeof quotes][
      Math.floor(Math.random() * quotes[category as keyof typeof quotes].length)
    ]
  }
}
