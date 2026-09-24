import { DifficultyLevel, RoutineItem, Language } from '../../types';

export interface GeneratedRoutineQuestion {
  id: string;
  type: 'after' | 'before' | 'at_time' | 'order_first';
  prompt: string;
  options: string[];
  correctAnswer: string;
}

const ACTIVITY_TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {},
  as: {
    'Wake up': 'টোপনিৰ পৰা উঠা',
    'Breakfast': 'ৰাতিপুৱাৰ জলপান',
    'Morning Medicine': 'ৰাতিপুৱাৰ ঔষধ',
    'Brain Activity': 'মগজুৰ খেল',
    'Lunch': 'দুপৰীয়াৰ সাজ',
    'Afternoon Walk': 'আবেলি খোজ কঢ়া',
    'Evening Medicine': 'সন্ধিয়াৰ ঔষধ',
    'Sleep': 'টোপনি / শুবলৈ যোৱা',
    'Dinner': 'নিশাৰ সাজ',
    'Morning Tea': 'ৰাতিপুৱাৰ চাহ',
    'Evening Tea': 'সন্ধিয়াৰ চাহ',
    'Reading': 'কিতাপ পঢ়া',
  },
  lus: {
    'Wake up': 'Zing thawh',
    'Breakfast': 'Tukṭhuan',
    'Morning Medicine': 'Zing damdawi',
    'Brain Activity': 'Thluak sawizawina',
    'Lunch': 'Chhun chaw',
    'Afternoon Walk': 'Tlaia lenharh',
    'Evening Medicine': 'Zan damdawi',
    'Sleep': 'Mut hun',
    'Dinner': 'Zan chaw',
    'Morning Tea': 'Zing thingpui',
    'Evening Tea': 'Tlai thingpui',
    'Reading': 'Lehkhabu chhiar',
  },
};

export function translateActivity(activityName: string, language: Language): string {
  if (language === 'en') return activityName;
  const dict = ACTIVITY_TRANSLATIONS[language];
  return (dict && dict[activityName]) || activityName;
}

export function generateRoutineQuestions(
  routines: RoutineItem[],
  difficulty: DifficultyLevel,
  language: Language = 'en'
): GeneratedRoutineQuestion[] {
  if (!routines || routines.length < 3) {
    const fallbackAnswer = translateActivity('Breakfast', language);
    let fallbackPrompt = 'What usually comes after waking up?';
    if (language === 'as') {
      fallbackPrompt = 'টোপনিৰ পৰা উঠাৰ পিছত সাধাৰণতে কি কৰা হয়?';
    } else if (language === 'lus') {
      fallbackPrompt = 'Zing thawh hnuah eng nge tih tlangpui a nih?';
    }

    const fallbackOptions = ['Breakfast', 'Dinner', 'Sleep', 'Evening Walk'].map((act) =>
      translateActivity(act, language)
    );

    return [
      {
        id: 'q-fallback',
        type: 'after',
        prompt: fallbackPrompt,
        options: fallbackOptions,
        correctAnswer: fallbackAnswer,
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
    const currentActTranslated = translateActivity(currentItem.activity, language);

    if (qType === 'after' && randomIndex < sorted.length - 1) {
      const nextItem = sorted[randomIndex + 1];
      const nextActTranslated = translateActivity(nextItem.activity, language);
      const distractors = sorted
        .filter((_, idx) => idx !== randomIndex + 1 && idx !== randomIndex)
        .map((item) => translateActivity(item.activity, language))
        .slice(0, 3);

      const options = [nextActTranslated, ...distractors].sort(() => 0.5 - Math.random());

      let prompt = `What comes after "${currentActTranslated}"?`;
      if (language === 'as') {
        prompt = `"${currentActTranslated}"-ৰ পিছত কি কৰা হয়?`;
      } else if (language === 'lus') {
        prompt = `"${currentActTranslated}" hnuah eng nge tih ṭhin?`;
      }

      questions.push({
        id: `q-after-${r}-${Date.now()}`,
        type: 'after',
        prompt,
        options,
        correctAnswer: nextActTranslated,
      });
    } else if (qType === 'before' && randomIndex > 0) {
      const prevItem = sorted[randomIndex - 1];
      const prevActTranslated = translateActivity(prevItem.activity, language);
      const distractors = sorted
        .filter((_, idx) => idx !== randomIndex - 1 && idx !== randomIndex)
        .map((item) => translateActivity(item.activity, language))
        .slice(0, 3);

      const options = [prevActTranslated, ...distractors].sort(() => 0.5 - Math.random());

      let prompt = `What comes before "${currentActTranslated}"?`;
      if (language === 'as') {
        prompt = `"${currentActTranslated}"-ৰ আগত কি কৰা হয়?`;
      } else if (language === 'lus') {
        prompt = `"${currentActTranslated}" hmaah eng nge tih ṭhin?`;
      }

      questions.push({
        id: `q-before-${r}-${Date.now()}`,
        type: 'before',
        prompt,
        options,
        correctAnswer: prevActTranslated,
      });
    } else if (qType === 'at_time') {
      const distractors = sorted
        .filter((item) => item.id !== currentItem.id)
        .map((item) => translateActivity(item.activity, language))
        .slice(0, 3);

      const options = [currentActTranslated, ...distractors].sort(() => 0.5 - Math.random());

      let prompt = `What activity is scheduled at ${currentItem.time}?`;
      if (language === 'as') {
        prompt = `${currentItem.time} বজাত কি কৰাৰ সময়সূচী আছে?`;
      } else if (language === 'lus') {
        prompt = `${currentItem.time} ah hian eng nge tih hun?`;
      }

      questions.push({
        id: `q-time-${r}-${Date.now()}`,
        type: 'at_time',
        prompt,
        options,
        correctAnswer: currentActTranslated,
      });
    } else {
      // Order which comes first
      const firstIdx = Math.floor(Math.random() * (sorted.length - 2));
      const secondIdx = firstIdx + 1 + Math.floor(Math.random() * (sorted.length - firstIdx - 1));
      const firstActivity = translateActivity(sorted[firstIdx].activity, language);
      const secondActivity = translateActivity(sorted[secondIdx].activity, language);

      let prompt = `Which activity comes earlier in your day: "${firstActivity}" or "${secondActivity}"?`;
      if (language === 'as') {
        prompt = `কোনটো কাম দিনটোত আগতে কৰা হয়: "${firstActivity}" নে "${secondActivity}"?`;
      } else if (language === 'lus') {
        prompt = `Khawi zawk hi nge i tih hmasak ṭhin: "${firstActivity}" nge "${secondActivity}"?`;
      }

      questions.push({
        id: `q-order-${r}-${Date.now()}`,
        type: 'order_first',
        prompt,
        options: [firstActivity, secondActivity].sort(() => 0.5 - Math.random()),
        correctAnswer: firstActivity,
      });
    }
  }

  return questions;
}
