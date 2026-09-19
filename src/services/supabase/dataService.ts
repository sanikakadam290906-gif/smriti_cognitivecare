import { Patient, Medication, RoutineItem, GameSession } from '../../types';
import { INITIAL_PATIENTS, INITIAL_MEDICATIONS, INITIAL_ROUTINES, INITIAL_GAME_SESSIONS } from '../../data/demoPatients';
import { supabase } from './client';

const STORAGE_KEYS = {
  PATIENTS: 'smriti_patients_v1',
  MEDICATIONS: 'smriti_medications_v1',
  ROUTINES: 'smriti_routines_v1',
  GAME_SESSIONS: 'smriti_game_sessions_v1',
  INITIALIZED: 'smriti_initialized_v1',
};

type SyncEventType = 'patients' | 'medications' | 'routines' | 'game_sessions' | 'all';
type Listener = (event: { type: SyncEventType; payload?: any }) => void;

class DataService {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<Listener> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel('smriti-sync-channel');
      this.channel.onmessage = (event) => {
        this.notifyLocalListeners(event.data);
      };
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key?.startsWith('smriti_')) {
          this.notifyLocalListeners({ type: 'all' });
        }
      });
    }

    this.initStorageIfEmpty();
  }

  private initStorageIfEmpty() {
    if (typeof window === 'undefined') return;
    const isInit = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!isInit) {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
      localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(INITIAL_MEDICATIONS));
      localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(INITIAL_ROUTINES));
      localStorage.setItem(STORAGE_KEYS.GAME_SESSIONS, JSON.stringify(INITIAL_GAME_SESSIONS));
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  }

  private broadcast(event: { type: SyncEventType; payload?: any }) {
    this.notifyLocalListeners(event);
    if (this.channel) {
      try {
        this.channel.postMessage(event);
      } catch {
        // Fallback or ignore
      }
    }
  }

  private notifyLocalListeners(event: { type: SyncEventType; payload?: any }) {
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error('Error executing sync listener:', err);
      }
    });
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // --- Patients ---
  public async getPatients(): Promise<Patient[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('patients').select('*');
        if (!error && data && data.length > 0) return data;
      } catch {
        // Fallback to local
      }
    }
    const raw = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    return raw ? JSON.parse(raw) : INITIAL_PATIENTS;
  }

  public async getPatient(id: string): Promise<Patient | undefined> {
    const patients = await this.getPatients();
    return patients.find((p) => p.id === id);
  }

  public async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
    const patients = await this.getPatients();
    const index = patients.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Patient not found');

    const updated: Patient = {
      ...patients[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    patients[index] = updated;
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));

    if (supabase) {
      try {
        await supabase.from('patients').update(updated).eq('id', id);
      } catch {
        // Silent catch
      }
    }

    this.broadcast({ type: 'patients', payload: updated });
    return updated;
  }

  public async addPatient(patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Patient> {
    const newId = `patient-${Date.now()}`;
    const now = new Date().toISOString();
    const newPatient: Patient = {
      ...patient,
      id: newId,
      createdAt: now,
      updatedAt: now,
    };

    const patients = await this.getPatients();
    patients.push(newPatient);
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));

    if (supabase) {
      try {
        await supabase.from('patients').insert([newPatient]);
      } catch {
        // Silent catch
      }
    }

    this.broadcast({ type: 'patients', payload: newPatient });
    return newPatient;
  }

  // --- Medications ---
  public async getMedications(patientId: string): Promise<Medication[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('medications').select('*').eq('patient_id', patientId);
        if (!error && data) return data;
      } catch {
        // Fallback to local
      }
    }
    const raw = localStorage.getItem(STORAGE_KEYS.MEDICATIONS);
    const all: Medication[] = raw ? JSON.parse(raw) : INITIAL_MEDICATIONS;
    return all.filter((m) => m.patientId === patientId);
  }

  public async updateMedication(id: string, updates: Partial<Medication>): Promise<Medication> {
    const raw = localStorage.getItem(STORAGE_KEYS.MEDICATIONS);
    const all: Medication[] = raw ? JSON.parse(raw) : INITIAL_MEDICATIONS;
    const index = all.findIndex((m) => m.id === id);
    if (index === -1) throw new Error('Medication not found');

    const updated: Medication = {
      ...all[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    all[index] = updated;
    localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(all));

    if (supabase) {
      try {
        await supabase.from('medications').update(updated).eq('id', id);
      } catch {
        // Silent catch
      }
    }

    this.broadcast({ type: 'medications', payload: updated });
    return updated;
  }

  public async addMedication(med: Omit<Medication, 'id' | 'updatedAt'>): Promise<Medication> {
    const newId = `med-${Date.now()}`;
    const newMed: Medication = {
      ...med,
      id: newId,
      updatedAt: new Date().toISOString(),
    };

    const raw = localStorage.getItem(STORAGE_KEYS.MEDICATIONS);
    const all: Medication[] = raw ? JSON.parse(raw) : INITIAL_MEDICATIONS;
    all.push(newMed);
    localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(all));

    if (supabase) {
      try {
        await supabase.from('medications').insert([newMed]);
      } catch {
        // Silent catch
      }
    }

    this.broadcast({ type: 'medications', payload: newMed });
    return newMed;
  }

  public async deleteMedication(id: string): Promise<void> {
    const raw = localStorage.getItem(STORAGE_KEYS.MEDICATIONS);
    const all: Medication[] = raw ? JSON.parse(raw) : INITIAL_MEDICATIONS;
    const filtered = all.filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(filtered));

    if (supabase) {
      try {
        await supabase.from('medications').delete().eq('id', id);
      } catch {
        // Silent catch
      }
    }

    this.broadcast({ type: 'medications', payload: { deletedId: id } });
  }

  // --- Routines ---
  public async getRoutines(patientId: string): Promise<RoutineItem[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('routines').select('*').eq('patient_id', patientId).order('order_index');
        if (!error && data) return data;
      } catch {
        // Fallback
      }
    }
    const raw = localStorage.getItem(STORAGE_KEYS.ROUTINES);
    const all: RoutineItem[] = raw ? JSON.parse(raw) : INITIAL_ROUTINES;
    return all.filter((r) => r.patientId === patientId).sort((a, b) => a.orderIndex - b.orderIndex);
  }

  public async updateRoutine(id: string, updates: Partial<RoutineItem>): Promise<RoutineItem> {
    const raw = localStorage.getItem(STORAGE_KEYS.ROUTINES);
    const all: RoutineItem[] = raw ? JSON.parse(raw) : INITIAL_ROUTINES;
    const index = all.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Routine not found');

    const updated: RoutineItem = {
      ...all[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    all[index] = updated;
    localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(all));

    if (supabase) {
      try {
        await supabase.from('routines').update(updated).eq('id', id);
      } catch {
        // Silent catch
      }
    }

    this.broadcast({ type: 'routines', payload: updated });
    return updated;
  }

  public async addRoutine(routine: Omit<RoutineItem, 'id' | 'updatedAt'>): Promise<RoutineItem> {
    const newId = `rt-${Date.now()}`;
    const newRoutine: RoutineItem = {
      ...routine,
      id: newId,
      updatedAt: new Date().toISOString(),
    };

    const raw = localStorage.getItem(STORAGE_KEYS.ROUTINES);
    const all: RoutineItem[] = raw ? JSON.parse(raw) : INITIAL_ROUTINES;
    all.push(newRoutine);
    localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(all));

    if (supabase) {
      try {
        await supabase.from('routines').insert([newRoutine]);
      } catch {
        // Silent catch
      }
    }

    this.broadcast({ type: 'routines', payload: newRoutine });
    return newRoutine;
  }

  public async deleteRoutine(id: string): Promise<void> {
    const raw = localStorage.getItem(STORAGE_KEYS.ROUTINES);
    const all: RoutineItem[] = raw ? JSON.parse(raw) : INITIAL_ROUTINES;
    const filtered = all.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(filtered));

    if (supabase) {
      try {
        await supabase.from('routines').delete().eq('id', id);
      } catch {
        // Silent catch
      }
    }

    this.broadcast({ type: 'routines', payload: { deletedId: id } });
  }

  // --- Game Sessions ---
  public async getGameSessions(patientId?: string): Promise<GameSession[]> {
    if (supabase) {
      try {
        let query = supabase.from('game_sessions').select('*').order('created_at', { ascending: false });
        if (patientId) {
          query = query.eq('patient_id', patientId);
        }
        const { data, error } = await query;
        if (!error && data) return data;
      } catch {
        // Fallback
      }
    }
    const raw = localStorage.getItem(STORAGE_KEYS.GAME_SESSIONS);
    const all: GameSession[] = raw ? JSON.parse(raw) : INITIAL_GAME_SESSIONS;
    if (patientId) {
      return all.filter((s) => s.patientId === patientId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async saveGameSession(session: Omit<GameSession, 'id' | 'createdAt'>): Promise<GameSession> {
    const newId = `session-${Date.now()}`;
    const now = new Date().toISOString();
    const newSession: GameSession = {
      ...session,
      id: newId,
      createdAt: now,
    };

    const raw = localStorage.getItem(STORAGE_KEYS.GAME_SESSIONS);
    const all: GameSession[] = raw ? JSON.parse(raw) : INITIAL_GAME_SESSIONS;
    all.unshift(newSession);
    localStorage.setItem(STORAGE_KEYS.GAME_SESSIONS, JSON.stringify(all));

    if (supabase) {
      try {
        await supabase.from('game_sessions').insert([newSession]);
      } catch {
        // Silent catch
      }
    }

    this.broadcast({ type: 'game_sessions', payload: newSession });
    return newSession;
  }

  // --- Reset Demo Data ---
  public async resetDemoData(): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
    localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(INITIAL_MEDICATIONS));
    localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(INITIAL_ROUTINES));
    localStorage.setItem(STORAGE_KEYS.GAME_SESSIONS, JSON.stringify(INITIAL_GAME_SESSIONS));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');

    this.broadcast({ type: 'all' });
  }
}

export const dataService = new DataService();
