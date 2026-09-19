import { DifficultyLevel, GameSession } from '../../types';

export interface DifficultyRecommendation {
  recommendedLevel: DifficultyLevel;
  reason: string;
  averageAccuracy: number;
  recentSessionsCount: number;
  trend: 'improving' | 'stable' | 'needs_support';
}

export function calculateAdaptiveDifficulty(
  currentDifficulty: DifficultyLevel,
  recentSessions: GameSession[]
): DifficultyRecommendation {
  if (!recentSessions || recentSessions.length === 0) {
    return {
      recommendedLevel: currentDifficulty,
      reason: 'Initial baseline active. Ready for gameplay sessions.',
      averageAccuracy: 75,
      recentSessionsCount: 0,
      trend: 'stable',
    };
  }

  // Take up to the 3 most recent sessions
  const windowSessions = recentSessions.slice(0, 3);
  const totalAccuracy = windowSessions.reduce((sum, s) => sum + s.accuracy, 0);
  const avgAccuracy = Math.round(totalAccuracy / windowSessions.length);

  // Trend analysis
  let trend: 'improving' | 'stable' | 'needs_support' = 'stable';
  if (windowSessions.length >= 2) {
    const latest = windowSessions[0].accuracy;
    const previous = windowSessions[1].accuracy;
    if (latest - previous >= 10) {
      trend = 'improving';
    } else if (previous - latest >= 15) {
      trend = 'needs_support';
    }
  }

  let recommended: DifficultyLevel = currentDifficulty;
  let reason = '';

  if (avgAccuracy > 75) {
    recommended = 'Hard';
    reason = `Recent accuracy is high (${avgAccuracy}%). Activity complexity can be gently increased.`;
  } else if (avgAccuracy >= 50) {
    recommended = 'Medium';
    reason = `Recent accuracy is steady (${avgAccuracy}%). Balanced cognitive engagement level maintained.`;
  } else {
    recommended = 'Easy';
    reason = `Recent accuracy is ${avgAccuracy}%. Recommending a gentler pace with fewer items to maintain confidence.`;
  }

  return {
    recommendedLevel: recommended,
    reason,
    averageAccuracy: avgAccuracy,
    recentSessionsCount: windowSessions.length,
    trend,
  };
}

export function getRoundsForDifficulty(difficulty: DifficultyLevel, gameType: string): number {
  switch (gameType) {
    case 'memory':
      // Easy: 3 pairs, Medium: 5 pairs, Hard: 8 pairs
      return difficulty === 'Easy' ? 3 : difficulty === 'Medium' ? 5 : 8;
    case 'find-object':
      return difficulty === 'Easy' ? 5 : difficulty === 'Medium' ? 7 : 10;
    case 'pattern':
      return difficulty === 'Easy' ? 5 : difficulty === 'Medium' ? 7 : 10;
    case 'routine':
      return difficulty === 'Easy' ? 5 : difficulty === 'Medium' ? 6 : 8;
    default:
      return 5;
  }
}
