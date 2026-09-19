import { DifficultyLevel, Language } from '../../types';
import { MemoryCard } from '../../types/games';
import { CULTURAL_ITEMS } from '../../data/culturalContent/nerObjects';

export function generateMemorySession(difficulty: DifficultyLevel, language: Language): MemoryCard[] {
  const pairCount = difficulty === 'Easy' ? 3 : difficulty === 'Medium' ? 5 : 8;

  // Shuffle cultural items and pick pairCount items
  const shuffledItems = [...CULTURAL_ITEMS].sort(() => 0.5 - Math.random());
  const selectedItems = shuffledItems.slice(0, pairCount);

  const cards: MemoryCard[] = [];

  selectedItems.forEach((item, index) => {
    const itemName = item.name[language] || item.name.en;
    // Push Card 1
    cards.push({
      cardId: `item-${index}-a-${Math.random()}`,
      itemId: item.id,
      name: itemName,
      iconType: item.iconType,
      isFlipped: false,
      isMatched: false,
    });
    // Push Card 2
    cards.push({
      cardId: `item-${index}-b-${Math.random()}`,
      itemId: item.id,
      name: itemName,
      iconType: item.iconType,
      isFlipped: false,
      isMatched: false,
    });
  });

  // Fisher-Yates shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
}
