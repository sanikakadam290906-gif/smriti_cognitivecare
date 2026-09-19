import { Patient, Medication, RoutineItem, GameSession } from '../types';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'patient-asha-devi',
    name: 'Asha Devi',
    age: 72,
    region: 'Assam',
    language: 'as',
    currentDifficulty: 'Medium',
    createdAt: '2026-09-10T08:00:00Z',
    updatedAt: '2026-09-19T09:00:00Z',
  },
  {
    id: 'patient-lalhmingliani',
    name: 'Lalhmingliani',
    age: 75,
    region: 'Mizoram',
    language: 'lus',
    currentDifficulty: 'Easy',
    createdAt: '2026-09-11T08:00:00Z',
    updatedAt: '2026-09-19T08:30:00Z',
  },
  {
    id: 'patient-rahul-sangma',
    name: 'Rahul Sangma',
    age: 68,
    region: 'Meghalaya',
    language: 'en',
    currentDifficulty: 'Hard',
    createdAt: '2026-09-12T08:00:00Z',
    updatedAt: '2026-09-18T16:00:00Z',
  },
];

export const INITIAL_MEDICATIONS: Medication[] = [
  // Asha Devi
  {
    id: 'med-asha-1',
    patientId: 'patient-asha-devi',
    name: 'Morning medicine',
    time: '10:00 AM',
    notes: 'Take with warm water after light breakfast',
    status: 'pending',
    updatedAt: '2026-09-19T08:00:00Z',
  },
  {
    id: 'med-asha-2',
    patientId: 'patient-asha-devi',
    name: 'Afternoon medicine',
    time: '2:00 PM',
    notes: 'Calcium tablet after lunch',
    status: 'pending',
    updatedAt: '2026-09-19T08:00:00Z',
  },
  {
    id: 'med-asha-3',
    patientId: 'patient-asha-devi',
    name: 'Evening medicine',
    time: '8:00 PM',
    notes: 'Blood pressure tablet before dinner',
    status: 'pending',
    updatedAt: '2026-09-19T08:00:00Z',
  },

  // Lalhmingliani
  {
    id: 'med-lal-1',
    patientId: 'patient-lalhmingliani',
    name: 'Zing damdawi (Morning medicine)',
    time: '9:30 AM',
    notes: 'Tukthuan eikham ah tui nen',
    status: 'taken',
    updatedAt: '2026-09-19T09:35:00Z',
  },
  {
    id: 'med-lal-2',
    patientId: 'patient-lalhmingliani',
    name: 'Zan damdawi (Night medicine)',
    time: '7:30 PM',
    notes: 'Chaw eikham ah',
    status: 'pending',
    updatedAt: '2026-09-19T08:00:00Z',
  },

  // Rahul Sangma
  {
    id: 'med-rahul-1',
    patientId: 'patient-rahul-sangma',
    name: 'Morning dose',
    time: '10:30 AM',
    notes: 'Daily vitamins and blood pressure tablet',
    status: 'pending',
    updatedAt: '2026-09-19T08:00:00Z',
  },
  {
    id: 'med-rahul-2',
    patientId: 'patient-rahul-sangma',
    name: 'Evening dose',
    time: '8:30 PM',
    notes: 'Night tablet after dinner',
    status: 'pending',
    updatedAt: '2026-09-19T08:00:00Z',
  },
];

export const INITIAL_ROUTINES: RoutineItem[] = [
  // Asha Devi
  { id: 'rt-asha-1', patientId: 'patient-asha-devi', time: '7:00 AM', activity: 'Wake up', orderIndex: 1, updatedAt: '2026-09-19T08:00:00Z' },
  { id: 'rt-asha-2', patientId: 'patient-asha-devi', time: '8:00 AM', activity: 'Breakfast', orderIndex: 2, updatedAt: '2026-09-19T08:00:00Z' },
  { id: 'rt-asha-3', patientId: 'patient-asha-devi', time: '10:00 AM', activity: 'Morning Medicine', orderIndex: 3, updatedAt: '2026-09-19T08:00:00Z' },
  { id: 'rt-asha-4', patientId: 'patient-asha-devi', time: '11:00 AM', activity: 'Brain Activity', orderIndex: 4, updatedAt: '2026-09-19T08:00:00Z' },
  { id: 'rt-asha-5', patientId: 'patient-asha-devi', time: '1:00 PM', activity: 'Lunch', orderIndex: 5, updatedAt: '2026-09-19T08:00:00Z' },
  { id: 'rt-asha-6', patientId: 'patient-asha-devi', time: '4:00 PM', activity: 'Afternoon Walk', orderIndex: 6, updatedAt: '2026-09-19T08:00:00Z' },
  { id: 'rt-asha-7', patientId: 'patient-asha-devi', time: '8:00 PM', activity: 'Evening Medicine', orderIndex: 7, updatedAt: '2026-09-19T08:00:00Z' },
  { id: 'rt-asha-8', patientId: 'patient-asha-devi', time: '9:30 PM', activity: 'Sleep', orderIndex: 8, updatedAt: '2026-09-19T08:00:00Z' },

  // Lalhmingliani
  { id: 'rt-lal-1', patientId: 'patient-lalhmingliani', time: '6:30 AM', activity: 'Thawh hun (Wake up)', orderIndex: 1, updatedAt: '2026-09-19T08:00:00Z' },
  { id: 'rt-lal-2', patientId: 'patient-lalhmingliani', time: '8:00 AM', activity: 'Tukthuan (Breakfast)', orderIndex: 2, updatedAt: '2026-09-19T08:00:00Z' },
  { id: 'rt-lal-3', patientId: 'patient-lalhmingliani', time: '9:30 AM', activity: 'Damdawi (Medicine)', orderIndex: 3, updatedAt: '2026-09-19T08:00:00Z' },
  { id: 'rt-lal-4', patientId: 'patient-lalhmingliani', time: '11:00 AM', activity: 'Hnathawh (Activity)', orderIndex: 4, updatedAt: '2026-09-19T08:00:00Z' },
  { id: 'rt-lal-5', patientId: 'patient-lalhmingliani', time: '1:00 PM', activity: 'Chhun chaw (Lunch)', orderIndex: 5, updatedAt: '2026-09-19T08:00:00Z' },
  { id: 'rt-lal-6', patientId: 'patient-lalhmingliani', time: '5:00 PM', activity: 'Vakchhuak (Walk)', orderIndex: 6, updatedAt: '2026-09-19T08:00:00Z' },
  { id: 'rt-lal-7', patientId: 'patient-lalhmingliani', time: '7:30 PM', activity: 'Damdawi (Night Medicine)', orderIndex: 7, updatedAt: '2026-09-19T08:00:00Z' },
  { id: 'rt-lal-8', patientId: 'patient-lalhmingliani', time: '9:00 PM', activity: 'Muthun (Sleep)', orderIndex: 8, updatedAt: '2026-09-19T08:00:00Z' },

  // Rahul Sangma
  { id: 'rt-rahul-1', patientId: 'patient-rahul-sangma', time: '7:00 AM', activity: 'Morning stretch', orderIndex: 1, updatedAt: '2026-09-19T08:00:00Z' },
  { id: 'rt-rahul-2', patientId: 'patient-rahul-sangma', time: '8:00 AM', activity: 'Breakfast', orderIndex: 2, updatedAt: '2026-09-19T08:00:00Z' },
  { id: 'rt-rahul-3', patientId: 'patient-rahul-sangma', time: '10:30 AM', activity: 'Morning Medicine', orderIndex: 3, updatedAt: '2026-09-19T08:00:00Z' },
  { id: 'rt-rahul-4', patientId: 'patient-rahul-sangma', time: '1:30 PM', activity: 'Lunch', orderIndex: 4, updatedAt: '2026-09-19T08:00:00Z' },
  { id: 'rt-rahul-5', patientId: 'patient-rahul-sangma', time: '5:00 PM', activity: 'Garden Walk', orderIndex: 5, updatedAt: '2026-09-19T08:00:00Z' },
  { id: 'rt-rahul-6', patientId: 'patient-rahul-sangma', time: '8:30 PM', activity: 'Evening Medicine', orderIndex: 6, updatedAt: '2026-09-19T08:00:00Z' },
  { id: 'rt-rahul-7', patientId: 'patient-rahul-sangma', time: '10:00 PM', activity: 'Sleep', orderIndex: 7, updatedAt: '2026-09-19T08:00:00Z' },
];

export const INITIAL_GAME_SESSIONS: GameSession[] = [
  {
    id: 'session-asha-1',
    patientId: 'patient-asha-devi',
    gameType: 'memory',
    difficulty: 'Medium',
    startTime: '2026-09-18T10:30:00Z',
    endTime: '2026-09-18T10:32:15Z',
    rounds: 7,
    correctAnswers: 6,
    incorrectAnswers: 1,
    accuracy: 85.7,
    averageResponseTime: 4.2,
    attempts: 1,
    createdAt: '2026-09-18T10:32:15Z',
  },
  {
    id: 'session-asha-2',
    patientId: 'patient-asha-devi',
    gameType: 'pattern',
    difficulty: 'Medium',
    startTime: '2026-09-19T09:15:00Z',
    endTime: '2026-09-19T09:17:10Z',
    rounds: 7,
    correctAnswers: 5,
    incorrectAnswers: 2,
    accuracy: 71.4,
    averageResponseTime: 5.1,
    attempts: 1,
    createdAt: '2026-09-19T09:17:10Z',
  },
  {
    id: 'session-lal-1',
    patientId: 'patient-lalhmingliani',
    gameType: 'find-object',
    difficulty: 'Easy',
    startTime: '2026-09-19T08:40:00Z',
    endTime: '2026-09-19T08:43:00Z',
    rounds: 5,
    correctAnswers: 4,
    incorrectAnswers: 1,
    accuracy: 80.0,
    averageResponseTime: 6.8,
    attempts: 1,
    createdAt: '2026-09-19T08:43:00Z',
  },
];
