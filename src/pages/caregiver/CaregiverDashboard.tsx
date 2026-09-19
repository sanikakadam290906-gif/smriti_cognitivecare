import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Patient, Medication, GameSession } from '../../types';
import { dataService } from '../../services/supabase/dataService';
import { useTranslation } from '../../i18n/LanguageContext';
import { MedicalDisclaimer } from '../../components/ui/MedicalDisclaimer';
import { Clock, CheckCircle2, AlertCircle, ChevronRight, User, Sparkles } from 'lucide-react';

export const CaregiverDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [medications, setMedications] = useState<Record<string, Medication[]>>({});
  const [sessions, setSessions] = useState<Record<string, GameSession[]>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadAllData();

    // Subscribe to live changes
    const unsubscribe = dataService.subscribe(() => {
      loadAllData();
    });

    return () => unsubscribe();
  }, []);

  const loadAllData = async () => {
    const pts = await dataService.getPatients();
    setPatients(pts);

    const medsMap: Record<string, Medication[]> = {};
    const sessMap: Record<string, GameSession[]> = {};

    for (const p of pts) {
      const [pMeds, pSessions] = await Promise.all([
        dataService.getMedications(p.id),
        dataService.getGameSessions(p.id),
      ]);
      medsMap[p.id] = pMeds;
      sessMap[p.id] = pSessions;
    }

    setMedications(medsMap);
    setSessions(sessMap);
    setLoading(false);
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-borderBase pb-6">
        <div>
          <span className="text-sm font-bold text-sage-700 uppercase tracking-wider">
            Caregiver Overview
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-ink-900 tracking-tight">
            Good morning
          </h1>
        </div>

        <button
          type="button"
          onClick={() => navigate('/caregiver/patients')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-borderBase bg-white text-ink-900 font-bold hover:bg-cream-100 transition-colors shadow-xs"
        >
          <User className="w-4 h-4 text-ink-600" />
          <span>Manage Patients</span>
        </button>
      </div>

      {/* Patients Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-ink-900">
            {t('navPatients')}
          </h2>
          <span className="text-sm font-semibold text-ink-500">
            {patients.length} active patients
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-ink-500">{t('loading')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map((patient) => {
              const patientMeds = medications[patient.id] || [];
              const patientSessions = sessions[patient.id] || [];
              const latestSession = patientSessions[0];

              const takenCount = patientMeds.filter((m) => m.status === 'taken').length;
              const totalMeds = patientMeds.length;
              const allMedsTaken = totalMeds > 0 && takenCount === totalMeds;

              return (
                <div
                  key={patient.id}
                  onClick={() => navigate(`/caregiver/patients/${patient.id}`)}
                  className="bg-white border-2 border-borderBase hover:border-sage-500 rounded-3xl p-6 shadow-card hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group select-none"
                >
                  {/* Card Top: Patient Name & Region */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-2xl font-extrabold text-ink-900 group-hover:text-sage-800 transition-colors">
                          {patient.name}
                        </h3>
                        <span className="text-sm font-bold text-ink-500">
                          {patient.age} • {patient.region}
                        </span>
                      </div>
                      <span className="px-2.5 py-1 bg-cream-200 text-ink-800 rounded-lg text-xs font-bold uppercase">
                        {patient.language}
                      </span>
                    </div>

                    {/* Status Highlights — Strictly NO explanatory paragraphs */}
                    <div className="space-y-3 pt-3 border-t border-borderBase/60">
                      {/* Medication Status */}
                      <div>
                        <span className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-1">
                          Medication
                        </span>
                        <div className="flex items-center gap-2">
                          {allMedsTaken ? (
                            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> All doses taken ({takenCount}/{totalMeds})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                              <AlertCircle className="w-4 h-4 text-amber-600" /> {takenCount} of {totalMeds} taken
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Last Activity & Accuracy */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div>
                          <span className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-1">
                            Last activity
                          </span>
                          <span className="text-sm font-bold text-ink-800 block">
                            {latestSession
                              ? new Date(latestSession.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : 'No activity yet'}
                          </span>
                        </div>

                        <div>
                          <span className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-1">
                            Accuracy
                          </span>
                          <span className="text-sm font-extrabold text-sage-700 block">
                            {latestSession ? `${latestSession.accuracy}%` : '—'}
                          </span>
                        </div>
                      </div>

                      {/* Current Difficulty */}
                      <div className="pt-1">
                        <span className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-1">
                          Difficulty
                        </span>
                        <span className="px-2.5 py-0.5 bg-sage-50 text-sage-800 border border-sage-200 rounded-md text-xs font-bold">
                          {patient.currentDifficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Link */}
                  <div className="mt-6 pt-4 border-t border-borderBase/60 flex items-center justify-between text-sm font-bold text-sage-700 group-hover:text-sage-800">
                    <span>Open Patient Care</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Small medical disclaimer banner */}
      <MedicalDisclaimer />
    </div>
  );
};
