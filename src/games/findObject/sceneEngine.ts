import { DifficultyLevel, Language } from '../../types';
import { SceneObject, VisualScene } from '../../types/games';
import { VISUAL_SCENES } from '../../data/culturalContent/visualScenes';

export interface FindObjectRound {
  scene: VisualScene;
  targetObject: SceneObject;
  distractors: SceneObject[];
  allObjects: SceneObject[];
  targetPrompt: string;
}

export function generateFindObjectSession(
  difficulty: DifficultyLevel,
  language: Language
): FindObjectRound[] {
  const roundCount = difficulty === 'Easy' ? 5 : difficulty === 'Medium' ? 7 : 10;
  const rounds: FindObjectRound[] = [];

  // Shuffle scenes
  const scenesPool = [...VISUAL_SCENES].sort(() => 0.5 - Math.random());

  for (let r = 0; r < roundCount; r++) {
    const scene = scenesPool[r % scenesPool.length];
    const availableObjects = [...scene.objects];

    // Pick target object
    const targetIndex = Math.floor(Math.random() * availableObjects.length);
    const target = availableObjects[targetIndex];

    // Adjust distractors based on difficulty
    const distractorPool = availableObjects.filter((_, idx) => idx !== targetIndex);
    let distractorCount = 2;
    if (difficulty === 'Medium') distractorCount = Math.min(distractorPool.length, 4);
    if (difficulty === 'Hard') distractorCount = distractorPool.length;

    const chosenDistractors = distractorPool.slice(0, distractorCount);

    // Randomize slight offsets for objects to feel fresh every time
    const randomizedAll = [target, ...chosenDistractors].map((obj) => {
      const xJitter = (Math.random() - 0.5) * 8;
      const yJitter = (Math.random() - 0.5) * 8;
      return {
        ...obj,
        xPercent: Math.min(88, Math.max(12, obj.xPercent + xJitter)),
        yPercent: Math.min(85, Math.max(15, obj.yPercent + yJitter)),
      };
    });

    const targetName = target.name[language] || target.name.en;
    let prompt = `Find the ${targetName}`;
    if (language === 'as') {
      prompt = `${targetName} ক'ত আছে বিচাৰক`;
    } else if (language === 'lus') {
      prompt = `${targetName} hi zawng chhuak rawh`;
    }

    rounds.push({
      scene,
      targetObject: target,
      distractors: chosenDistractors,
      allObjects: randomizedAll.sort(() => 0.5 - Math.random()),
      targetPrompt: prompt,
    });
  }

  return rounds;
}
