import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Patient, Medication, RoutineItem, DifficultyLevel } from '../../types';
import { dataService } from '../../services/supabase/dataService';
import { useTranslation } from '../../i18n/LanguageContext';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Plus, Trash2, Edit2, Check, Clock, Sparkles } from 'lucide-react';

export const CarePlanPage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [routines, setRoutines] = useState<RoutineItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<string | null>(null);

  // New med form
  const [medName, setMedName] = useState('');
  const [medTime, setMedTime] = useState('10:00 AM');
  const [medNotes, setMedNotes] = useState('');
  const [showAddMed, setShowAddMed] = useState(false);

  // New routine form
  const [routineActivity, setRoutineActivity] = useState('');
  const [routineTime, setRoutineTime] = useState('11:00 AM');
  const [showAddRoutine, setShowAddRoutine] = useState(false);

  useEffect(() => {
    if (patientId) {
      loadData(patientId);
    }
  }, [patientId]);

  const loadData = async (id: string) => {
    const [p, meds, rts] = await Promise.all([
      dataService.getPatient(id),
      dataService.getMedications(id),
      dataService.getRoutines(id),
    ]);

    if (p) setPatient(p);
    setMedications(meds);
    setRoutines(rts);
    setLoading(false);
  };

  const showFeedback = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddMedication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !medName.trim()) return;

    await dataService.addMedication({
      patientId,
      name: medName.trim(),
      time: medTime.trim(),
      notes: medNotes.trim() || undefined,
      status: 'pending',
    });

    setMedName('');
    setMedNotes('');
    setShowAddMed(false);
    showFeedback('Medication added and synchronized to patient.');
    await loadData(patientId);
  };

  const handleDeleteMedication = async (id: string) => {
    if (!patientId) return;
    await dataService.deleteMedication(id);
    showFeedback('Medication removed.');
    await loadData(patientId);
  };

  const handleUpdateMedStatus = async (id: string, status: 'pending' | 'taken') => {
    if (!patientId) return;
    await dataService.updateMedication(id, { status });
    showFeedback(`Medication status changed to ${status}.`);
    await loadData(patientId);
  };

  const handleAddRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !routineActivity.trim()) return;

    const nextOrder = routines.length + 1;
    await dataService.addRoutine({
      patientId,
      activity: routineActivity.trim(),
      time: routineTime.trim(),
      orderIndex: nextOrder,
    });

    setRoutineActivity('');
    setShowAddRoutine(false);
    showFeedback('Daily routine updated. Routine Recall game updated.');
    await loadData(patientId);
  };

  const handleDeleteRoutine = async (id: string) => {
    if (!patientId) return;
    await dataService.deleteRoutine(id);
    showFeedback('Routine activity deleted.');
    await loadData(patientId);
  };

  const handleDifficultyOverride = async (newDiff: DifficultyLevel) => {
    if (!patientId || !patient) return;
    await dataService.updatePatient(patientId, { currentDifficulty: newDiff });
    setPatient({ ...patient, currentDifficulty: newDiff });
    showFeedback(`Difficulty updated to ${newDiff}. Patient's next game will use this level.`);
  };

  if (loading) {
    return <div className="p-8 text-center text-ink-500">{t('loading')}</div>;
  }

  if (!patient) {
    return <div className="p-8 text-center text-ink-700">Patient not found.</div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-borderBase pb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/caregiver/patients/${patient.id}`)}
            className="p-2.5 rounded-xl border border-borderBase bg-white text-ink-700 hover:bg-cream-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-ink-900 tracking-tight">
              Care Plan: {patient.name}
            </h1>
            <span className="text-sm font-bold text-ink-500">
              One source of truth: changes sync immediately to the patient interface.
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/caregiver/patients/${patient.id}`)}
          className="px-4 py-2 rounded-xl border border-borderBase bg-white text-ink-800 font-bold hover:bg-cream-100"
        >
          View Patient Overview
        </button>
      </div>

      {/* Sync feedback toast */}
      {notification && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-500 text-emerald-900 rounded-2xl font-bold text-sm animate-in fade-in flex items-center justify-between">
          <span>{notification}</span>
        </div>
      )}

      {/* 1. Difficulty Override Section */}
      <div className="bg-white border-2 border-borderBase rounded-3xl p-6 shadow-card">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sage-700" />
              <h2 className="text-xl font-bold text-ink-900">Activity Difficulty</h2>
            </div>
            <p className="text-sm text-ink-500 mt-1">
              Caregiver manual override for cognitive exercises.
            </p>
          </div>

          <span className="px-3 py-1 bg-sage-50 border border-sage-200 text-sage-800 font-black rounded-lg text-sm">
            Current: {patient.currentDifficulty}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          {(['Easy', 'Medium', 'Hard'] as DifficultyLevel[]).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => handleDifficultyOverride(level)}
              className={`py-3 px-4 rounded-xl font-bold text-sm sm:text-base border-2 transition-all ${
                patient.currentDifficulty === level
                  ? 'bg-sage-600 text-white border-sage-700 shadow-xs'
                  : 'bg-cream-50 hover:bg-cream-100 text-ink-800 border-borderBase'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Medications Section */}
      <div className="bg-white border-2 border-borderBase rounded-3xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-ink-900">Medications</h2>
            <p className="text-xs text-ink-500">
              Times and instructions for patient reminders.
            </p>
          </div>

          <Button
            variant="outline"
            size="md"
            onClick={() => setShowAddMed(!showAddMed)}
            className="gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Medicine</span>
          </Button>
        </div>

        {/* Add Med Form */}
        {showAddMed && (
          <form onSubmit={handleAddMedication} className="p-4 bg-cream-50 border border-borderBase rounded-2xl space-y-3 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">Medicine Name</label>
                <input
                  type="text"
                  required
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  placeholder="e.g. Morning medicine"
                  className="w-full px-3 py-2 rounded-xl border border-borderBase bg-white font-semibold text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">Time</label>
                <input
                  type="text"
                  required
                  value={medTime}
                  onChange={(e) => setMedTime(e.target.value)}
                  placeholder="e.g. 10:00 AM"
                  className="w-full px-3 py-2 rounded-xl border border-borderBase bg-white font-semibold text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-700 mb-1">Optional Notes</label>
              <input
                type="text"
                value={medNotes}
                onChange={(e) => setMedNotes(e.target.value)}
                placeholder="e.g. Take with warm water after breakfast"
                className="w-full px-3 py-2 rounded-xl border border-borderBase bg-white font-semibold text-sm"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="md" onClick={() => setShowAddMed(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md">
                Save Medicine
              </Button>
            </div>
          </form>
        )}

        {/* Meds List */}
        <div className="space-y-3">
          {medications.map((med) => (
            <div
              key={med.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-cream-50 border border-borderBase rounded-2xl gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg text-ink-900">{med.name}</span>
                  <span className="text-sm font-bold text-ink-600 bg-white px-2 py-0.5 rounded border border-borderBase">
                    {med.time}
                  </span>
                </div>
                {med.notes && (
                  <p className="text-xs text-ink-600 mt-1">{med.notes}</p>
                )}
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleUpdateMedStatus(med.id, med.status === 'taken' ? 'pending' : 'taken')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    med.status === 'taken'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-white hover:bg-cream-100 text-ink-700 border-borderBase'
                  }`}
                >
                  {med.status === 'taken' ? '✓ Taken (Click to reset)' : 'Mark as Taken'}
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteMedication(med.id)}
                  className="p-2 text-ink-400 hover:text-red-700 transition-colors"
                  title="Delete medication"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Daily Routine Section */}
      <div className="bg-white border-2 border-borderBase rounded-3xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-ink-900">Daily Routine</h2>
            <p className="text-xs text-ink-500">
              Used directly by the personalized Routine Recall cognitive game.
            </p>
          </div>

          <Button
            variant="outline"
            size="md"
            onClick={() => setShowAddRoutine(!showAddRoutine)}
            className="gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Routine Item</span>
          </Button>
        </div>

        {/* Add Routine Form */}
        {showAddRoutine && (
          <form onSubmit={handleAddRoutine} className="p-4 bg-cream-50 border border-borderBase rounded-2xl space-y-3 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">Activity Name</label>
                <input
                  type="text"
                  required
                  value={routineActivity}
                  onChange={(e) => setRoutineActivity(e.target.value)}
                  placeholder="e.g. Afternoon Walk"
                  className="w-full px-3 py-2 rounded-xl border border-borderBase bg-white font-semibold text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">Time</label>
                <input
                  type="text"
                  required
                  value={routineTime}
                  onChange={(e) => setRoutineTime(e.target.value)}
                  placeholder="e.g. 4:00 PM"
                  className="w-full px-3 py-2 rounded-xl border border-borderBase bg-white font-semibold text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="md" onClick={() => setShowAddRoutine(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md">
                Save Activity
              </Button>
            </div>
          </form>
        )}

        {/* Routine Items List */}
        <div className="space-y-2.5">
          {routines.map((rt) => (
            <div
              key={rt.id}
              className="flex items-center justify-between p-3.5 bg-cream-50 border border-borderBase rounded-xl"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-cream-200 text-ink-700 flex items-center justify-center text-xs font-bold">
                  {rt.orderIndex}
                </span>
                <span className="font-bold text-ink-900">{rt.activity}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-ink-600 bg-white px-2.5 py-1 rounded-lg border border-borderBase">
                  {rt.time}
                </span>

                <button
                  type="button"
                  onClick={() => handleDeleteRoutine(rt.id)}
                  className="p-1.5 text-ink-400 hover:text-red-700 transition-colors"
                  title="Delete routine item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
