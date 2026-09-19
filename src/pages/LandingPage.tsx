import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n/LanguageContext';
import { MedicalDisclaimer } from '../components/ui/MedicalDisclaimer';
import { HeartHandshake, User, PlayCircle, ChevronRight } from 'lucide-react';
import { Patient } from '../types';

interface LandingPageProps {
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ patients, onSelectPatient }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPatientSelectModal, setShowPatientSelectModal] = useState(false);

  const handleChoosePatient = () => {
    setShowPatientSelectModal(true);
  };

  const handleSelectAndProceed = (patientId: string) => {
    onSelectPatient(patientId);
    setShowPatientSelectModal(false);
    navigate('/patient/home');
  };

  const handleStartDemoFlow = () => {
    // Default demo starts with Asha Devi
    const asha = patients.find((p) => p.name.includes('Asha')) || patients[0];
    if (asha) {
      onSelectPatient(asha.id);
    }
    navigate('/caregiver/dashboard');
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col justify-between p-6 sm:p-10 selection:bg-sage-200">
      <main className="max-w-3xl mx-auto w-full flex-1 flex flex-col justify-center py-10">
        {/* Brand & Statement */}
        <div className="text-center mb-12 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-sage-700 text-white flex items-center justify-center font-black text-3xl mx-auto shadow-card">
            S
          </div>

          <div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-ink-900 leading-none">
              SMRITI
            </h1>
            <span className="block text-base sm:text-lg font-bold text-sage-800 tracking-wider uppercase mt-1">
              Cognitive Care
            </span>
          </div>

          <p className="text-lg sm:text-xl text-ink-700 max-w-xl mx-auto font-semibold leading-relaxed">
            "Simple support for memory, routines and everyday care."
          </p>
        </div>

        {/* Three Large Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-2xl mx-auto w-full">
          {/* Choice 1: CAREGIVER */}
          <button
            type="button"
            onClick={() => navigate('/caregiver/dashboard')}
            className="p-6 bg-white hover:bg-cream-200 border-2 border-borderBase hover:border-sage-600 rounded-3xl flex flex-col items-center justify-center text-center gap-4 transition-all touch-target-lg shadow-card active:scale-98 group select-none"
          >
            <div className="w-16 h-16 rounded-2xl bg-sage-100 border border-sage-200 text-sage-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-9 h-9" />
            </div>
            <div>
              <span className="block text-xl font-extrabold text-ink-900">
                CAREGIVER
              </span>
              <span className="text-xs font-bold text-ink-500">
                Monitor & configure care
              </span>
            </div>
          </button>

          {/* Choice 2: PATIENT */}
          <button
            type="button"
            onClick={handleChoosePatient}
            className="p-6 bg-white hover:bg-cream-200 border-2 border-borderBase hover:border-sage-600 rounded-3xl flex flex-col items-center justify-center text-center gap-4 transition-all touch-target-lg shadow-card active:scale-98 group select-none"
          >
            <div className="w-16 h-16 rounded-2xl bg-peach-100 border border-peach-200 text-peach-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <User className="w-9 h-9" />
            </div>
            <div>
              <span className="block text-xl font-extrabold text-ink-900">
                PATIENT
              </span>
              <span className="text-xs font-bold text-ink-500">
                Play games & check routine
              </span>
            </div>
          </button>

          {/* Choice 3: DEMO MODE */}
          <button
            type="button"
            onClick={handleStartDemoFlow}
            className="p-6 bg-white hover:bg-cream-200 border-2 border-borderBase hover:border-sage-600 rounded-3xl flex flex-col items-center justify-center text-center gap-4 transition-all touch-target-lg shadow-card active:scale-98 group select-none"
          >
            <div className="w-16 h-16 rounded-2xl bg-sky-100 border border-sky-200 text-sky-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <PlayCircle className="w-9 h-9" />
            </div>
            <div>
              <span className="block text-xl font-extrabold text-ink-900">
                DEMO MODE
              </span>
              <span className="text-xs font-bold text-ink-500">
                Explore full synced workflow
              </span>
            </div>
          </button>
        </div>
      </main>

      {/* Footer Medical Disclaimer */}
      <footer className="max-w-xl mx-auto w-full pt-8">
        <MedicalDisclaimer />
      </footer>

      {/* Patient Selection Modal */}
      {showPatientSelectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-xs">
          <div className="bg-white border-2 border-borderBase rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-lg animate-in fade-in">
            <h2 className="text-2xl font-black text-ink-900 mb-1">
              Select Patient
            </h2>
            <p className="text-sm font-semibold text-ink-500 mb-6">
              Choose which demo profile to enter:
            </p>

            <div className="space-y-3">
              {patients.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectAndProceed(p.id)}
                  className="w-full p-4 rounded-2xl border-2 border-borderBase hover:border-sage-600 bg-cream-50 hover:bg-cream-100 flex items-center justify-between text-left transition-all touch-target select-none"
                >
                  <div>
                    <span className="block font-extrabold text-lg text-ink-900">
                      {p.name}
                    </span>
                    <span className="text-xs font-bold text-ink-500">
                      {p.age} years • {p.region} • {p.language === 'as' ? 'অসমীয়া' : p.language === 'lus' ? 'Mizo' : 'English'}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-ink-400" />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowPatientSelectModal(false)}
              className="mt-6 w-full py-2.5 rounded-xl border border-borderBase text-ink-700 font-bold hover:bg-cream-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
