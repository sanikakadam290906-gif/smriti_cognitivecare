import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Patient, GameSession, Medication } from '../../types';
import { dataService } from '../../services/supabase/dataService';
import { calculateAdaptiveDifficulty } from '../../services/adaptiveEngine/difficulty';
import { useTranslation } from '../../i18n/LanguageContext';
import { MedicalDisclaimer } from '../../components/ui/MedicalDisclaimer';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ArrowLeft, Brain, Sparkles, CheckCircle2, Clock, Activity, TrendingUp } from 'lucide-react';

export const PatientProgressPage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
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
    const [p, sess, meds] = await Promise.all([
      dataService.getPatient(id),
      dataService.getGameSessions(id),
      dataService.getMedications(id),
    ]);

    if (p) setPatient(p);
    setSessions(sess);
    setMedications(meds);
    setLoading(false);
  };

  if (loading) {
    return <div className="p-8 text-center text-ink-500">{t('loading')}</div>;
  }

  if (!patient) {
    return <div className="p-8 text-center text-ink-700">Patient not found.</div>;
  }

  // Adaptive recommendation
  const adaptive = calculateAdaptiveDifficulty(patient.currentDifficulty, sessions);

  // Medication adherence
  const takenMeds = medications.filter((m) => m.status === 'taken').length;
  const adherenceRate = medications.length > 0 ? Math.round((takenMeds / medications.length) * 100) : 100;

  // Chart data: reverse sessions so chronological from left to right
  const chartData = [...sessions]
    .reverse()
    .slice(-7)
    .map((s, idx) => ({
      session: `#${idx + 1}`,
      game: s.gameType,
      accuracy: Math.round(s.accuracy),
      date: new Date(s.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    }));

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
              Progress: {patient.name}
            </h1>
            <span className="text-sm font-bold text-ink-500">
              Cognitive engagement history & adaptive difficulty
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/caregiver/patients/${patient.id}/care-plan`)}
          className="px-4 py-2 rounded-xl border border-borderBase bg-white text-ink-800 font-bold hover:bg-cream-100"
        >
          Adjust Care Plan
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-borderBase rounded-2xl p-4 shadow-card">
          <span className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-1">
            Sessions Completed
          </span>
          <span className="text-3xl font-black text-ink-900">{sessions.length}</span>
        </div>

        <div className="bg-white border-2 border-borderBase rounded-2xl p-4 shadow-card">
          <span className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-1">
            Avg. Accuracy
          </span>
          <span className="text-3xl font-black text-sage-700">
            {adaptive.averageAccuracy}%
          </span>
        </div>

        <div className="bg-white border-2 border-borderBase rounded-2xl p-4 shadow-card">
          <span className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-1">
            Med Adherence
          </span>
          <span className="text-3xl font-black text-ink-900">{adherenceRate}%</span>
        </div>

        <div className="bg-white border-2 border-borderBase rounded-2xl p-4 shadow-card">
          <span className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-1">
            Active Difficulty
          </span>
          <span className="text-2xl font-black text-sage-800 bg-sage-50 px-2 py-0.5 rounded border border-sage-200 inline-block mt-1">
            {patient.currentDifficulty}
          </span>
        </div>
      </div>

      {/* Adaptive Difficulty System Card */}
      <div className="bg-white border-2 border-borderBase rounded-3xl p-6 shadow-card">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sage-100 text-sage-800 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-ink-900">
                Adaptive Difficulty Engine
              </h2>
              <span className="text-xs text-ink-500 font-semibold">
                Transparent rule-based adjustment based on recent performance
              </span>
            </div>
          </div>

          <span className="px-3 py-1 bg-sage-100 border border-sage-300 text-sage-900 rounded-lg text-sm font-black">
            Recommended: {adaptive.recommendedLevel}
          </span>
        </div>

        <p className="text-sm font-semibold text-ink-700 bg-cream-50 p-4 rounded-xl border border-borderBase leading-relaxed">
          {adaptive.reason}
        </p>
      </div>

      {/* Clean Simple Recharts Accuracy Over Time */}
      <div className="bg-white border-2 border-borderBase rounded-3xl p-6 shadow-card">
        <h2 className="text-xl font-bold text-ink-900 mb-1">
          Accuracy Over Recent Sessions
        </h2>
        <p className="text-xs text-ink-500 mb-6">
          Recent gameplay sessions percentage accuracy
        </p>

        {chartData.length < 2 ? (
          <div className="p-12 text-center text-ink-500 bg-cream-50 rounded-2xl border border-borderBase">
            Need at least 2 completed game sessions to display trend chart.
          </div>
        ) : (
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5DFD5" vertical={false} />
                <XAxis dataKey="session" stroke="#65746B" fontSize={12} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#65746B" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FAF6EF',
                    borderColor: '#E3DDD2',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                  }}
                  formatter={(value: any) => [`${value}%`, 'Accuracy']}
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#527961"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#527961', strokeWidth: 2, stroke: '#FFFFFF' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Recent Sessions Table */}
      <div className="bg-white border-2 border-borderBase rounded-3xl p-6 shadow-card">
        <h2 className="text-xl font-bold text-ink-900 mb-4">
          Session History
        </h2>

        {sessions.length === 0 ? (
          <p className="text-sm text-ink-500">No game sessions recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-borderBase text-ink-400 uppercase text-xs">
                  <th className="py-2.5 px-3 font-bold">Activity</th>
                  <th className="py-2.5 px-3 font-bold">Difficulty</th>
                  <th className="py-2.5 px-3 font-bold">Score</th>
                  <th className="py-2.5 px-3 font-bold">Accuracy</th>
                  <th className="py-2.5 px-3 font-bold">Avg Response</th>
                  <th className="py-2.5 px-3 font-bold">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderBase/60">
                {sessions.map((s) => (
                  <tr key={s.id} className="hover:bg-cream-50 font-semibold text-ink-800">
                    <td className="py-3 px-3 capitalize font-bold text-ink-900">
                      {s.gameType.replace('-', ' ')}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-cream-200 text-ink-800 rounded text-xs">
                        {s.difficulty}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {s.correctAnswers} / {s.rounds}
                    </td>
                    <td className="py-3 px-3 font-bold text-sage-700">
                      {s.accuracy}%
                    </td>
                    <td className="py-3 px-3 text-ink-500">
                      {s.averageResponseTime}s
                    </td>
                    <td className="py-3 px-3 text-xs text-ink-500">
                      {new Date(s.createdAt).toLocaleDateString()} {new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <MedicalDisclaimer />
    </div>
  );
};
