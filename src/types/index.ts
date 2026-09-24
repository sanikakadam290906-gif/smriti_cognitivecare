export type Language = 'en' | 'as' | 'lus';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface Patient {
  id: string;
  name: string;
  age: number;
  region: string;
  language: Language;
  currentDifficulty: DifficultyLevel;
  createdAt: string;
  updatedAt: string;
}

export type MedicationStatus = 'pending' | 'taken' | 'remind_later';

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  time: string;
  notes?: string;
  status: MedicationStatus;
  updatedAt: string;
}

export interface RoutineItem {
  id: string;
  patientId: string;
  time: string;
  activity: string;
  orderIndex: number;
  updatedAt: string;
}

export type GameType = 'memory' | 'find-object' | 'pattern' | 'routine';

export interface GameSession {
  id: string;
  patientId: string;
  gameType: GameType;
  difficulty: DifficultyLevel;
  startTime: string;
  endTime: string;
  rounds: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number; // percentage 0-100
  averageResponseTime: number; // in seconds
  attempts: number;
  createdAt: string;
}

export interface GameRoundResult {
  roundNumber: number;
  isCorrect: boolean;
  responseTime: number;
  prompt?: string;
}

export type SOSAlertStatus = 'active' | 'acknowledged' | 'resolved' | 'cancelled';

export interface SOSAlert {
  id: string;
  patientId: string;
  caregiverId?: string | null;
  status: SOSAlertStatus;
  message?: string;
  createdAt: string;
  acknowledgedAt?: string | null;
  resolvedAt?: string | null;
  acknowledgedBy?: string | null;
  resolvedBy?: string | null;
  patientName?: string;
  patientRegion?: string;
}

