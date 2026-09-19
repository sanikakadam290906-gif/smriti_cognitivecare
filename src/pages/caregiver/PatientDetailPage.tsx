import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Patient, Medication, RoutineItem, GameSession } from '../../types';
import { dataService } from '../../services/supabase/dataService';
import { useTranslation } from '../../i18n/LanguageContext';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Clock, CheckCircle2, AlertCircle, Edit, TrendingUp, CalendarCheck, Sparkles } from 'lucide-react';

export const PatientDetailPage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [routines, setRoutines] = useState<RoutineItem[]>([]);
  const [recentSessions, setRecentSessions] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (patientId) {
      loadData(patientId);

      const unsubscribe = dataService.subscribe(() => {
        loadData(patientId);
      });

      return () => unsubscribe();
    }
  }, [patientId]);

  const loadData = async (id: string) => {
    const [p, meds, rts, sess] = await Promise.all([
      dataService.getPatient(id),
      dataService.getMedications(id),
      dataService.getRoutines(id),
      dataService.getGameSessions(id),
    ]);

    if (p) setPatient(p);
    setMedications(meds);
    setRoutines(rts);
    setRecentSessions(sess);
    setLoading(false);
  };

  if (loading) {
    return <div className="p-8 text-center text-ink-500">{t('loading')}</div>;
  }

  if (!patient) {
    return (
      <div className="p-8 text-center text-ink-700">
        <p className="mb-4">Patient not found.</p>
        <button
          onClick={() => navigate('/caregiver/dashboard')}
          className="px-4 py-2 bg-sage-600 text-white rounded-xl font-bold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const takenCount = medications.filter((m) => m.status === 'taken').length;
  const latestSession = recentSessions[0];

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* Top Bar with Back Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-borderBase pb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/caregiver/dashboard')}
            className="p-2.5 rounded-xl border border-borderBase bg-white text-ink-700 hover:bg-cream-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-ink-900 tracking-tight">
              {patient.name}
            </h1>
            <span className="text-sm font-bold text-ink-500">
              {patient.age} years • {patient.region} • {patient.language === 'as' ? 'Assamese' : patient.language === 'lus' ? 'Mizo' : 'English'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/caregiver/patients/${patient.id}/care-plan`)}
            className="gap-2"
          >
            <Edit className="w-4 h-4 text-ink-700" />
            <span>Edit Care Plan</span>
          </Button>

          <Button
            variant="primary"
            onClick={() => navigate(`/caregiver/patients/${patient.id}/progress`)}
            className="gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            <span>View Progress</span>
          </Button>
        </div>
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Medication Status Card */}
        <div className="bg-white border-2 border-borderBase rounded-3xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-ink-900">Today's Medication</h2>
            <span className="text-sm font-bold text-ink-500">
              {takenCount} of {medications.length} taken
            </span>
          </div>

          {medications.length === 0 ? (
            <p className="text-sm text-ink-500">No medications scheduled.</p>
          ) : (
            <div className="space-y-3">
              {medications.map((med) => (
                <div
                  key={med.id}
                  className="flex items-center justify-between p-3.5 bg-cream-50 border border-borderBase rounded-xl"
                >
                  <div>
                    <span className="font-extrabold text-ink-900 block">{med.name}</span>
                    <span className="text-xs text-ink-500 font-bold">{med.time}</span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                      med.status === 'taken'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : med.status === 'remind_later'
                        ? 'bg-amber-50 text-amber-900 border-amber-300'
                        : 'bg-cream-200 text-ink-700 border-borderBase'
                    }`}
                  >
                    {med.status === 'taken' ? '✓ Taken' : med.status === 'remind_later' ? 'Remind later' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Daily Routine Summary */}
        <div className="bg-white border-2 border-borderBase rounded-3xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-ink-900">Daily Routine</h2>
            <span className="text-sm font-bold text-ink-500">
              {routines.length} activities
            </span>
          </div>

          {routines.length === 0 ? (
            <p className="text-sm text-ink-500">No routine scheduled.</p>
          ) : (
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {routines.map((rt) => (
                <div
                  key={rt.id}
                  className="flex items-center justify-between p-3 bg-cream-50 border border-borderBase rounded-xl text-sm"
                >
                  <span className="font-bold text-ink-900">{rt.activity}</span>
                  <span className="text-ink-600 font-bold bg-white px-2 py-0.5 rounded border border-borderBase">
                    {rt.time}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Cognitive Activity */}
        <div className="bg-white border-2 border-borderBase rounded-3xl p-6 shadow-card">
          <h2 className="text-xl font-bold text-ink-900 mb-4">Recent Activity</h2>

          {latestSession ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-cream-50 border border-borderBase rounded-xl">
                <div>
                  <span className="font-extrabold text-ink-900 block capitalize">
                    {latestSession.gameType.replace('-', ' ')}
                  </span>
                  <span className="text-xs text-ink-500 font-bold">
                    {new Date(latestSession.createdAt).toLocaleDateString()} at{' '}
                    {new Date(latestSession.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-sage-700 block">
                    {latestSession.accuracy}%
                  </span>
                  <span className="text-xs font-semibold text-ink-500">
                    {latestSession.correctAnswers}/{latestSession.rounds} correct
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-ink-500">No activity sessions recorded yet.</p>
          )}
        </div>

        {/* Current Difficulty Status */}
        <div className="bg-white border-2 border-borderBase rounded-3xl p-6 shadow-card flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Current Difficulty</h2>
            <p className="text-sm text-ink-500 mb-4">
              Configured level for cognitive memory games.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sage-50 border-2 border-sage-500 rounded-xl text-sage-800 font-black text-lg">
              <Sparkles className="w-5 h-5 text-sage-600" />
              <span>{patient.currentDifficulty}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-borderBase/60">
            <button
              type="button"
              onClick={() => navigate(`/caregiver/patients/${patient.id}/care-plan`)}
              className="text-sm font-bold text-sage-700 hover:text-sage-800 underline"
            >
              Adjust difficulty in Care Plan →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
