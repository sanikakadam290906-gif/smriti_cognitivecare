import React, { useState } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import { Language } from '../../types';
import { dataService } from '../../services/supabase/dataService';
import { Button } from '../../components/ui/Button';
import { MedicalDisclaimer } from '../../components/ui/MedicalDisclaimer';
import { RotateCcw, Globe, Shield, Check, Info } from 'lucide-react';

export const CaregiverSettingsPage: React.FC = () => {
  const { language, setLanguage, t } = useTranslation();

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleResetData = async () => {
    await dataService.resetDemoData();
    setIsResetConfirmOpen(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3500);
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-borderBase pb-6">
        <span className="text-sm font-bold text-sage-700 uppercase tracking-wider">
          Configuration
        </span>
        <h1 className="text-3xl font-black text-ink-900 tracking-tight">
          {t('navSettings')}
        </h1>
      </div>

      {resetSuccess && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-500 text-emerald-900 rounded-2xl font-bold text-sm flex items-center gap-2 animate-in fade-in">
          <Check className="w-5 h-5 text-emerald-600" />
          <span>Demo data successfully reset to original seed state.</span>
        </div>
      )}

      {/* Language Preferences */}
      <div className="bg-white border-2 border-borderBase rounded-3xl p-6 shadow-card space-y-4">
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6 text-sage-700" />
          <div>
            <h2 className="text-xl font-bold text-ink-900">Interface Language</h2>
            <p className="text-xs text-ink-500">
              Only 3 regional languages supported in this version.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {[
            { code: 'en' as Language, name: 'English', native: 'English' },
            { code: 'as' as Language, name: 'Assamese', native: 'অসমীয়া' },
            { code: 'lus' as Language, name: 'Mizo', native: 'Mizo ṭawng' },
          ].map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                language === lang.code
                  ? 'bg-sage-50 border-sage-600 text-sage-900 shadow-xs'
                  : 'bg-white hover:bg-cream-100 border-borderBase text-ink-800'
              }`}
            >
              <span className="block font-bold text-lg">{lang.native}</span>
              <span className="text-xs text-ink-500 font-medium">{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Reset Demo Data */}
      <div className="bg-white border-2 border-borderBase rounded-3xl p-6 shadow-card space-y-4">
        <div className="flex items-center gap-3">
          <RotateCcw className="w-6 h-6 text-amber-700" />
          <div>
            <h2 className="text-xl font-bold text-ink-900">Reset Demo Data</h2>
            <p className="text-xs text-ink-500">
              Restores initial patients (Asha Devi, Lalhmingliani, Rahul Sangma), initial routines, and clean schedules.
            </p>
          </div>
        </div>

        <div>
          <Button
            variant="outline"
            onClick={() => setIsResetConfirmOpen(true)}
            className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
          >
            Reset Demo Data to Default
          </Button>
        </div>
      </div>

      {/* About Smriti & Safety */}
      <div className="bg-white border-2 border-borderBase rounded-3xl p-6 shadow-card space-y-3">
        <div className="flex items-center gap-3">
          <Info className="w-6 h-6 text-sage-700" />
          <h2 className="text-xl font-bold text-ink-900">About Smriti</h2>
        </div>

        <p className="text-sm text-ink-700 leading-relaxed">
          Smriti is an AI-enabled cognitive engagement and memory assistance platform designed for elderly individuals in the North-Eastern Region (NER) of India. Built for caregiver monitoring and respectful, cultural engagement.
        </p>

        <MedicalDisclaimer />
      </div>

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-xs">
          <div className="bg-white border-2 border-borderBase rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-lg animate-in fade-in">
            <h2 className="text-xl font-bold text-ink-900 mb-2">
              Confirm Data Reset
            </h2>
            <p className="text-sm text-ink-600 mb-6">
              Are you sure you want to reset all patient routines, medications, and gameplay history back to the initial demo seed? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsResetConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={handleResetData}
              >
                Yes, Reset All
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
