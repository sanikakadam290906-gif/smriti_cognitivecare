import { DifficultyLevel } from '../../types';
import { PatternElement, PatternRound } from '../../types/games';
import { PATTERN_RULES, PATTERN_VISUAL_SETS } from '../../data/culturalContent/patternSets';

export function generatePatternSession(difficulty: DifficultyLevel): PatternRound[] {
  const roundCount = difficulty === 'Easy' ? 5 : difficulty === 'Medium' ? 7 : 10;
  const filteredRules = PATTERN_RULES.filter(
    (rule) =>
      rule.difficulty === difficulty ||
      (difficulty === 'Medium' && rule.difficulty === 'Easy') ||
      (difficulty === 'Hard' && rule.difficulty !== 'Easy')
  );

  const rounds: PatternRound[] = [];

  for (let r = 0; r < roundCount; r++) {
    // Pick rule
    const rule = filteredRules[r % filteredRules.length];

    // Pick visual set
    const visualSet = PATTERN_VISUAL_SETS[Math.floor(Math.random() * PATTERN_VISUAL_SETS.length)];
    const elementsPool = [...visualSet.elements].sort(() => 0.5 - Math.random());

    // Build sequence
    const fullSequence: PatternElement[] = rule.structure.map((symbolIndex) => {
      return elementsPool[symbolIndex % elementsPool.length];
    });

    const missingIndex = rule.missingIndex < fullSequence.length ? rule.missingIndex : fullSequence.length - 1;
    const correctAnswer = fullSequence[missingIndex];

    const sequenceWithBlank: (PatternElement | null)[] = fullSequence.map((el, idx) =>
      idx === missingIndex ? null : el
    );

    // Pick 3 distractors
    const distractors = elementsPool.filter((el) => el.id !== correctAnswer.id);
    const optionsPool = [correctAnswer, ...distractors.slice(0, 3)].sort(() => 0.5 - Math.random());

    rounds.push({
      sequence: sequenceWithBlank,
      missingIndex,
      correctAnswer,
      options: optionsPool,
      ruleDescription: rule.id,
    });
  }

  return rounds;
}
