import { DifficultyLevel, RoutineItem } from '../../types';

export interface GeneratedRoutineQuestion {
  id: string;
  type: 'after' | 'before' | 'at_time' | 'order_first';
  prompt: string;
  options: string[];
  correctAnswer: string;
}

export function generateRoutineQuestions(
  routines: RoutineItem[],
  difficulty: DifficultyLevel
): GeneratedRoutineQuestion[] {
  if (!routines || routines.length < 3) {
    // Fallback if routine is too short
    return [
      {
        id: 'q-fallback',
        type: 'after',
        prompt: 'What usually comes after waking up?',
        options: ['Breakfast', 'Dinner', 'Sleep', 'Evening Walk'],
        correctAnswer: 'Breakfast',
      },
    ];
  }

  const roundCount = difficulty === 'Easy' ? 5 : difficulty === 'Medium' ? 6 : 8;
  const sorted = [...routines].sort((a, b) => a.orderIndex - b.orderIndex);
  const questions: GeneratedRoutineQuestion[] = [];

  const questionTypes: ('after' | 'before' | 'at_time' | 'order_first')[] = [
    'after',
    'before',
    'at_time',
    'order_first',
  ];

  for (let r = 0; r < roundCount; r++) {
    const qType = questionTypes[r % questionTypes.length];
    const randomIndex = Math.floor(Math.random() * (sorted.length - 2)) + 1; // 1 to length-2
    const currentItem = sorted[randomIndex];

    if (qType === 'after' && randomIndex < sorted.length - 1) {
      const nextItem = sorted[randomIndex + 1];
      const distractors = sorted
        .filter((_, idx) => idx !== randomIndex + 1 && idx !== randomIndex)
        .map((item) => item.activity)
        .slice(0, 3);

      const options = [nextItem.activity, ...distractors].sort(() => 0.5 - Math.random());

      questions.push({
        id: `q-after-${r}-${Date.now()}`,
        type: 'after',
        prompt: `What comes after "${currentItem.activity}"?`,
        options,
        correctAnswer: nextItem.activity,
      });
    } else if (qType === 'before' && randomIndex > 0) {
      const prevItem = sorted[randomIndex - 1];
      const distractors = sorted
        .filter((_, idx) => idx !== randomIndex - 1 && idx !== randomIndex)
        .map((item) => item.activity)
        .slice(0, 3);

      const options = [prevItem.activity, ...distractors].sort(() => 0.5 - Math.random());

      questions.push({
        id: `q-before-${r}-${Date.now()}`,
        type: 'before',
        prompt: `What comes before "${currentItem.activity}"?`,
        options,
        correctAnswer: prevItem.activity,
      });
    } else if (qType === 'at_time') {
      const distractors = sorted
        .filter((item) => item.id !== currentItem.id)
        .map((item) => item.activity)
        .slice(0, 3);

      const options = [currentItem.activity, ...distractors].sort(() => 0.5 - Math.random());

      questions.push({
        id: `q-time-${r}-${Date.now()}`,
        type: 'at_time',
        prompt: `What activity is scheduled at ${currentItem.time}?`,
        options,
        correctAnswer: currentItem.activity,
      });
    } else {
      // Order which comes first
      const firstIdx = Math.floor(Math.random() * (sorted.length - 2));
      const secondIdx = firstIdx + 1 + Math.floor(Math.random() * (sorted.length - firstIdx - 1));
      const firstActivity = sorted[firstIdx].activity;
      const secondActivity = sorted[secondIdx].activity;

      questions.push({
        id: `q-order-${r}-${Date.now()}`,
        type: 'order_first',
        prompt: `Which activity comes earlier in your day: "${firstActivity}" or "${secondActivity}"?`,
        options: [firstActivity, secondActivity].sort(() => 0.5 - Math.random()),
        correctAnswer: firstActivity,
      });
    }
  }

  return questions;
}
