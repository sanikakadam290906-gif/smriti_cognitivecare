import React, { useState, useEffect } from 'react';
import { Patient, Medication } from '../../types';
import { useTranslation } from '../../i18n/LanguageContext';
import { VoiceButton } from '../../components/ui/VoiceButton';
import { Button } from '../../components/ui/Button';
import { dataService } from '../../services/supabase/dataService';
import { Check, Clock, Pill } from 'lucide-react';

interface PatientMedicinesPageProps {
  patient: Patient;
}

export const PatientMedicinesPage: React.FC<PatientMedicinesPageProps> = ({ patient }) => {
  const { t } = useTranslation();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadMedications();

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

  const handleUpdateStatus = async (medId: string, status: 'taken' | 'remind_later') => {
    if (updatingId) return; // Prevent double submission
    setUpdatingId(medId);
    try {
      await dataService.updateMedication(medId, { status });
      await loadMedications();
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-28 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 tracking-tight">
            {t('navMedicines')}
          </h1>
          <p className="text-sm font-semibold text-ink-500">
            {patient.name} • {t('todaysMedication')}
          </p>
        </div>
        <VoiceButton textToSpeak={t('patientVoicePromptMeds')} />
      </div>

      {loading ? (
        <div className="p-8 text-center text-ink-500">{t('loading')}</div>
      ) : medications.length === 0 ? (
        <div className="p-8 bg-white border-2 border-borderBase rounded-3xl text-center text-ink-700 shadow-card">
          <Pill className="w-12 h-12 text-ink-400 mx-auto mb-3" />
          <p className="text-lg font-bold">{t('noMedsScheduled')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {medications.map((med) => {
            const isTaken = med.status === 'taken';

            return (
              <div
                key={med.id}
                className={`bg-white border-2 rounded-3xl p-5 sm:p-6 shadow-card transition-all ${
                  isTaken ? 'border-emerald-300 bg-emerald-50/20' : 'border-borderBase'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-ink-900 leading-snug">
                      {med.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-5 h-5 text-ink-500" />
                      <span className="text-lg font-bold text-ink-800">{med.time}</span>
                    </div>
                    {med.notes && (
                      <p className="text-sm text-ink-600 mt-1 font-medium">{med.notes}</p>
                    )}
                  </div>

                  <span
                    className={`px-3 py-1 rounded-xl text-xs sm:text-sm font-bold border ${
                      isTaken
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : med.status === 'remind_later'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-cream-200 text-ink-800 border-borderBase'
                    }`}
                  >
                    {isTaken ? '✓ ' + t('taken') : med.status === 'remind_later' ? t('remindMeLater') : t('pendingDose')}
                  </span>
                </div>

                {/* Large elderly action buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-borderBase/60">
                  <Button
                    variant={isTaken ? 'secondary' : 'success'}
                    size="lg"
                    disabled={updatingId === med.id || isTaken}
                    onClick={() => handleUpdateStatus(med.id, 'taken')}
                    className="w-full text-base sm:text-lg font-bold gap-2"
                  >
                    <Check className="w-6 h-6" />
                    <span>{isTaken ? '✓ ' + t('taken') : t('taken')}</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    disabled={updatingId === med.id || isTaken}
                    onClick={() => handleUpdateStatus(med.id, 'remind_later')}
                    className="w-full text-base sm:text-lg font-bold text-ink-700"
                  >
                    {t('remindMeLater')}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
