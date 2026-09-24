import React, { useState, useEffect } from 'react';
import { Patient, RoutineItem } from '../../types';
import { useTranslation } from '../../i18n/LanguageContext';
import { VoiceButton } from '../../components/ui/VoiceButton';
import { dataService } from '../../services/supabase/dataService';
import { Clock, CalendarCheck } from 'lucide-react';
import { translateActivity } from '../../games/routine/routineGameEngine';

interface PatientRoutinePageProps {
  patient: Patient;
}

export const PatientRoutinePage: React.FC<PatientRoutinePageProps> = ({ patient }) => {
  const { language, t } = useTranslation();
  const [routines, setRoutines] = useState<RoutineItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadRoutines();

    const unsubscribe = dataService.subscribe((event) => {
      if (event.type === 'routines' || event.type === 'all') {
        loadRoutines();
      }
    });

    return () => unsubscribe();
  }, [patient.id]);

  const loadRoutines = async () => {
    const data = await dataService.getRoutines(patient.id);
    setRoutines(data);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-28 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 tracking-tight">
            {t('navRoutine')}
          </h1>
          <p className="text-sm font-semibold text-ink-500">
            {patient.name} • {t('dailySchedule')}
          </p>
        </div>
        <VoiceButton textToSpeak={t('patientVoicePromptRoutine')} />
      </div>

      {loading ? (
        <div className="p-8 text-center text-ink-500">{t('loading')}</div>
      ) : routines.length === 0 ? (
        <div className="p-8 bg-white border-2 border-borderBase rounded-3xl text-center text-ink-700 shadow-card">
          <CalendarCheck className="w-12 h-12 text-ink-400 mx-auto mb-3" />
          <p className="text-lg font-bold">{t('noRoutinesScheduled')}</p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-1 before:bg-sage-200">
          {routines.map((item) => (
            <div
              key={item.id}
              className="relative bg-white border-2 border-borderBase rounded-2xl p-4 sm:p-5 shadow-card flex items-center justify-between gap-4"
            >
              {/* Timeline dot */}
              <div className="absolute -left-5 sm:-left-6 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-sage-600 border-2 border-white ring-2 ring-sage-200" />

              <div>
                <span className="text-xl sm:text-2xl font-extrabold text-ink-900 block leading-tight">
                  {translateActivity(item.activity, language)}
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-cream-100 border border-borderBase px-3 py-1.5 rounded-xl shrink-0">
                <Clock className="w-4 h-4 text-ink-500" />
                <span className="text-base sm:text-lg font-bold text-ink-800">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
