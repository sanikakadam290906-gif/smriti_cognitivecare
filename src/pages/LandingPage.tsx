import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n/LanguageContext';
import { MedicalDisclaimer } from '../components/ui/MedicalDisclaimer';
import { HeartHandshake, User, PlayCircle, ChevronRight, Globe } from 'lucide-react';
import { Patient, Language } from '../types';

interface LandingPageProps {
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ patients, onSelectPatient }) => {
  const { language, setLanguage, t } = useTranslation();
  const navigate = useNavigate();
  const [showPatientSelectModal, setShowPatientSelectModal] = useState(false);

  const handleChoosePatient = () => {
    setShowPatientSelectModal(true);
  };

  const handleSelectAndProceed = (patientId: string) => {
    const selectedPatient = patients.find((p) => p.id === patientId);
    if (selectedPatient?.language) {
      setLanguage(selectedPatient.language);
    }
    onSelectPatient(patientId);
    setShowPatientSelectModal(false);
    navigate('/patient/home');
  };

  const handleStartDemoFlow = () => {
    // English is the default language for Demo Mode
    const saved = localStorage.getItem('smriti_language');
    if (!saved) {
      setLanguage('en');
    }
    const asha = patients.find((p) => p.name.includes('Asha')) || patients[0];
    if (asha) {
      onSelectPatient(asha.id);
    }
    navigate('/caregiver/dashboard');
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col justify-between p-4 sm:p-8 selection:bg-sage-200">
      {/* Top Bar with Language Selector */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-end pb-4">
        <div className="flex items-center gap-1.5 bg-white border border-borderBase p-1 rounded-2xl shadow-xs">
          <Globe className="w-4 h-4 text-sage-700 ml-2" />
          <span className="text-xs font-bold text-ink-500 mr-1 hidden sm:inline">{t('switchLanguage')}:</span>
          {[
            { code: 'en' as Language, label: 'English' },
            { code: 'as' as Language, label: 'অসমীয়া' },
            { code: 'lus' as Language, label: 'Mizo' },
          ].map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                language === lang.code
                  ? 'bg-sage-600 text-white shadow-xs'
                  : 'text-ink-700 hover:bg-cream-100'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-3xl mx-auto w-full flex-1 flex flex-col justify-center py-6 sm:py-10">
        {/* Brand & Statement */}
        <div className="text-center mb-8 sm:mb-12 space-y-3 sm:space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-sage-700 text-white flex items-center justify-center font-black text-3xl mx-auto shadow-card">
            S
          </div>

          <div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-ink-900 leading-none">
              {t('appName')}
            </h1>
            <span className="block text-base sm:text-lg font-bold text-sage-800 tracking-wider uppercase mt-1">
              {t('appTagline')}
            </span>
          </div>

          <p className="text-lg sm:text-xl text-ink-700 max-w-xl mx-auto font-semibold leading-relaxed">
            "{t('appStatement')}"
          </p>
        </div>

        {/* Three Large Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-2xl mx-auto w-full">
          {/* Choice 1: CAREGIVER */}
          <button
            type="button"
            onClick={() => navigate('/caregiver/dashboard')}
            className="p-5 sm:p-6 bg-white hover:bg-cream-200 border-2 border-borderBase hover:border-sage-600 rounded-3xl flex flex-col items-center justify-center text-center gap-3 sm:gap-4 transition-all touch-target-lg shadow-card active:scale-98 group select-none"
          >
            <div className="w-16 h-16 rounded-2xl bg-sage-100 border border-sage-200 text-sage-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-9 h-9" />
            </div>
            <div>
              <span className="block text-lg sm:text-xl font-extrabold text-ink-900">
                {t('caregiver')}
              </span>
              <span className="text-xs font-bold text-ink-500">
                {t('continueAsCaregiver')}
              </span>
            </div>
          </button>

          {/* Choice 2: PATIENT */}
          <button
            type="button"
            onClick={handleChoosePatient}
            className="p-5 sm:p-6 bg-white hover:bg-cream-200 border-2 border-borderBase hover:border-sage-600 rounded-3xl flex flex-col items-center justify-center text-center gap-3 sm:gap-4 transition-all touch-target-lg shadow-card active:scale-98 group select-none"
          >
            <div className="w-16 h-16 rounded-2xl bg-peach-100 border border-peach-200 text-peach-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <User className="w-9 h-9" />
            </div>
            <div>
              <span className="block text-lg sm:text-xl font-extrabold text-ink-900">
                {t('patient')}
              </span>
              <span className="text-xs font-bold text-ink-500">
                {t('continueAsPatient')}
              </span>
            </div>
          </button>

          {/* Choice 3: DEMO MODE */}
          <button
            type="button"
            onClick={handleStartDemoFlow}
            className="p-5 sm:p-6 bg-white hover:bg-cream-200 border-2 border-borderBase hover:border-sage-600 rounded-3xl flex flex-col items-center justify-center text-center gap-3 sm:gap-4 transition-all touch-target-lg shadow-card active:scale-98 group select-none"
          >
            <div className="w-16 h-16 rounded-2xl bg-sky-100 border border-sky-200 text-sky-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <PlayCircle className="w-9 h-9" />
            </div>
            <div>
              <span className="block text-lg sm:text-xl font-extrabold text-ink-900">
                {t('demoMode')}
              </span>
              <span className="text-xs font-bold text-ink-500">
                {t('exploreDemo')}
              </span>
            </div>
          </button>
        </div>
      </main>

      {/* Footer Medical Disclaimer */}
      <footer className="max-w-xl mx-auto w-full pt-6">
        <MedicalDisclaimer />
      </footer>

      {/* Patient Selection Modal */}
      {showPatientSelectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-xs">
          <div className="bg-white border-2 border-borderBase rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-lg animate-in fade-in">
            <h2 className="text-2xl font-black text-ink-900 mb-1">
              {t('selectPatient')}
            </h2>
            <p className="text-sm font-semibold text-ink-500 mb-6">
              {t('choosePatientProfile')}
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
                      {p.age} years • {p.region}
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
