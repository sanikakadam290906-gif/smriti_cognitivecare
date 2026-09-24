import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Patient, Medication } from '../../types';
import { useTranslation } from '../../i18n/LanguageContext';
import { VoiceButton } from '../../components/ui/VoiceButton';
import { Button } from '../../components/ui/Button';
import { dataService } from '../../services/supabase/dataService';
import { Check, Clock, Brain, Search, Puzzle, CalendarCheck } from 'lucide-react';

import { PatientSOSButton } from '../../components/patient/PatientSOSButton';

interface PatientHomePageProps {
  patient: Patient;
}

export const PatientHomePage: React.FC<PatientHomePageProps> = ({ patient }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingMedId, setUpdatingMedId] = useState<string | null>(null);

  useEffect(() => {
    loadMedications();

    // Subscribe to real-time updates from caregiver
    const unsubscribe = dataService.subscribe((event) => {
      if (event.type === 'medications' || event.type === 'all') {
        loadMedications();
      }
    });

    return () => unsubscribe();
  }, [patient.id]);

  const loadMedications = async () => {
    const data = await dataService.getMedications(patient.id);
    setMedications(data);
    setLoading(false);
  };

  const handleMarkMedication = async (medId: string, status: 'taken' | 'remind_later') => {
    setUpdatingMedId(medId);
    try {
      await dataService.updateMedication(medId, { status });
      await loadMedications();
    } finally {
      setUpdatingMedId(null);
    }
  };

  // Find next pending or active medication for today
  const pendingMed = medications.find((m) => m.status === 'pending') || medications[0];

  const greetingText = `${t('goodMorning')}, ${patient.name.split(' ')[0]}. ${t('letsHaveAGoodDay')}`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-28 space-y-6 sm:space-y-8">
      {/* Warm Greeting Section */}
      <div className="bg-cream-50 border-2 border-borderBase rounded-3xl p-6 sm:p-7 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 tracking-tight leading-snug">
            {t('goodMorning')}, {patient.name.split(' ')[0]}.
          </h1>
          <p className="text-lg text-ink-700 mt-1 font-semibold">
            {t('letsHaveAGoodDay')}
          </p>
        </div>
        <VoiceButton textToSpeak={greetingText} />
      </div>

      {/* Emergency SOS Banner Card */}
      <PatientSOSButton patient={patient} variant="banner" />

      {/* Today's Medication Section */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xl sm:text-2xl font-bold text-ink-900">
            {t('todaysMedication')}
          </h2>
          <button
            type="button"
            onClick={() => navigate('/patient/medicines')}
            className="text-sm font-bold text-sage-700 hover:text-sage-800 underline"
          >
            {t('viewAll')}
          </button>
        </div>

        {loading ? (
          <div className="p-6 bg-white border border-borderBase rounded-2xl text-center text-ink-500">
            {t('loading')}
          </div>
        ) : pendingMed ? (
          <div className="bg-white border-2 border-borderBase rounded-3xl p-6 shadow-card">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-ink-900">
                  {pendingMed.name}
                </h3>
                <span className="inline-flex items-center gap-1.5 text-base font-bold text-ink-700 mt-1">
                  <Clock className="w-5 h-5 text-ink-500" />
                  {pendingMed.time}
                </span>
                {pendingMed.notes && (
                  <p className="text-sm text-ink-500 mt-1">{pendingMed.notes}</p>
                )}
              </div>

              <span
                className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-bold border ${
                  pendingMed.status === 'taken'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : pendingMed.status === 'remind_later'
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'bg-cream-200 text-ink-700 border-borderBase'
                }`}
              >
                {pendingMed.status === 'taken'
                  ? t('taken')
                  : pendingMed.status === 'remind_later'
                  ? t('remindMeLater')
                  : t('pendingDose')}
              </span>
            </div>

            {/* Large elderly-friendly action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Button
                variant={pendingMed.status === 'taken' ? 'secondary' : 'success'}
                size="lg"
                disabled={updatingMedId === pendingMed.id || pendingMed.status === 'taken'}
                onClick={() => handleMarkMedication(pendingMed.id, 'taken')}
                className="w-full text-base sm:text-lg font-bold gap-2"
              >
                <Check className="w-6 h-6" />
                <span>{pendingMed.status === 'taken' ? '✓ ' + t('taken') : t('taken')}</span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                disabled={updatingMedId === pendingMed.id || pendingMed.status === 'taken'}
                onClick={() => handleMarkMedication(pendingMed.id, 'remind_later')}
                className="w-full text-base sm:text-lg font-bold text-ink-700"
              >
                {t('remindMeLater')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-white border border-borderBase rounded-2xl text-center text-ink-500">
            {t('noMedsScheduled')}
          </div>
        )}
      </div>

      {/* Today's Activities — strictly NO explanatory text under cards */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-ink-900 mb-4 px-1">
          {t('todaysActivities')}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Card 1: Memory Match */}
          <button
            type="button"
            onClick={() => navigate('/patient/games/memory')}
            className="p-5 sm:p-6 bg-white hover:bg-cream-200 active:bg-cream-300 border-2 border-borderBase rounded-3xl flex flex-col items-center justify-center gap-3 transition-all touch-target-lg shadow-card text-center select-none"
          >
            <div className="w-16 h-16 rounded-2xl bg-sage-100 border border-sage-200 text-sage-800 flex items-center justify-center">
              <Brain className="w-9 h-9" />
            </div>
            <span className="text-base sm:text-lg font-extrabold text-ink-900 leading-tight">
              {t('memoryMatch')}
            </span>
          </button>

          {/* Card 2: Find the Object */}
          <button
            type="button"
            onClick={() => navigate('/patient/games/find-object')}
            className="p-5 sm:p-6 bg-white hover:bg-cream-200 active:bg-cream-300 border-2 border-borderBase rounded-3xl flex flex-col items-center justify-center gap-3 transition-all touch-target-lg shadow-card text-center select-none"
          >
            <div className="w-16 h-16 rounded-2xl bg-sky-100 border border-sky-200 text-sky-700 flex items-center justify-center">
              <Search className="w-9 h-9" />
            </div>
            <span className="text-base sm:text-lg font-extrabold text-ink-900 leading-tight">
              {t('findTheObject')}
            </span>
          </button>

          {/* Card 3: Complete the Pattern */}
          <button
            type="button"
            onClick={() => navigate('/patient/games/pattern')}
            className="p-5 sm:p-6 bg-white hover:bg-cream-200 active:bg-cream-300 border-2 border-borderBase rounded-3xl flex flex-col items-center justify-center gap-3 transition-all touch-target-lg shadow-card text-center select-none"
          >
            <div className="w-16 h-16 rounded-2xl bg-peach-100 border border-peach-200 text-peach-700 flex items-center justify-center">
              <Puzzle className="w-9 h-9" />
            </div>
            <span className="text-base sm:text-lg font-extrabold text-ink-900 leading-tight">
              {t('completeThePattern')}
            </span>
          </button>

          {/* Card 4: Routine Recall */}
          <button
            type="button"
            onClick={() => navigate('/patient/games/routine')}
            className="p-5 sm:p-6 bg-white hover:bg-cream-200 active:bg-cream-300 border-2 border-borderBase rounded-3xl flex flex-col items-center justify-center gap-3 transition-all touch-target-lg shadow-card text-center select-none"
          >
            <div className="w-16 h-16 rounded-2xl bg-lavender-100 border border-lavender-200 text-lavender-700 flex items-center justify-center">
              <CalendarCheck className="w-9 h-9" />
            </div>
            <span className="text-base sm:text-lg font-extrabold text-ink-900 leading-tight">
              {t('routineRecall')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
