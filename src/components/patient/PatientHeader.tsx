import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Patient, Language } from '../../types';
import { useTranslation } from '../../i18n/LanguageContext';
import { ArrowLeftRight, LogOut, Globe, Check } from 'lucide-react';
import { PatientSOSButton } from './PatientSOSButton';

interface PatientHeaderProps {
  patient: Patient;
  allPatients: Patient[];
  onSelectPatient: (patientId: string) => void;
}

export const PatientHeader: React.FC<PatientHeaderProps> = ({
  patient,
  allPatients,
  onSelectPatient,
}) => {
  const { language, setLanguage, t } = useTranslation();
  const navigate = useNavigate();
  const [showSwitchMenu, setShowSwitchMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const languages: { code: Language; name: string; native: string }[] = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
    { code: 'lus', name: 'Mizo', native: 'Mizo ṭawng' },
  ];

  const currentLangObj = languages.find((l) => l.code === language) || languages[0];

  return (
    <header className="bg-cream-50 border-b-2 border-borderBase px-3 sm:px-4 py-2.5 sm:py-3 sticky top-0 z-30 shadow-subtle">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-sage-200 border border-sage-500 text-sage-800 flex items-center justify-center font-bold text-base sm:text-lg shrink-0">
            {patient.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-base sm:text-xl text-ink-900 leading-tight truncate max-w-[100px] xs:max-w-[140px] sm:max-w-none">
                {patient.name}
              </span>
              <span className="text-[10px] sm:text-xs bg-cream-200 border border-borderBase px-1.5 sm:px-2 py-0.5 rounded-md text-ink-700 font-semibold shrink-0">
                {patient.region}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs text-ink-500 font-semibold block">
              {patient.age} years
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Prominent Emergency SOS Button */}
          <PatientSOSButton patient={patient} />

          {/* Interface Language Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                setShowSwitchMenu(false);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-borderBase bg-white text-ink-800 font-bold hover:bg-cream-200 transition-colors touch-target focus-visible:outline-3 text-xs sm:text-sm"
              title={t('switchLanguage')}
              aria-label={t('switchLanguage')}
              aria-expanded={showLangMenu}
            >
              <Globe className="w-4 h-4 text-sage-700" />
              <span>{currentLangObj.code.toUpperCase()}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-borderBase rounded-2xl shadow-lg p-1.5 z-50 animate-in fade-in">
                <span className="block px-3 py-1.5 text-xs font-bold text-ink-500 uppercase tracking-wider">
                  {t('switchLanguage')}
                </span>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setLanguage(l.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold flex items-center justify-between transition-colors ${
                      language === l.code
                        ? 'bg-sage-100 text-sage-900'
                        : 'text-ink-800 hover:bg-cream-100'
                    }`}
                  >
                    <span>{l.native}</span>
                    {language === l.code && <Check className="w-4 h-4 text-sage-700" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Patient Quick Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowSwitchMenu(!showSwitchMenu);
                setShowLangMenu(false);
              }}
              className="p-2.5 rounded-xl border border-borderBase bg-white text-ink-700 hover:bg-cream-200 transition-colors touch-target focus-visible:outline-3"
              title="Switch Demo Patient"
              aria-label="Switch Demo Patient"
              aria-expanded={showSwitchMenu}
            >
              <ArrowLeftRight className="w-5 h-5 text-ink-700" />
            </button>

            {showSwitchMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-borderBase rounded-2xl shadow-lg p-2 z-50 animate-in fade-in">
                <span className="block px-3 py-1.5 text-xs font-bold text-ink-500 uppercase tracking-wider">
                  Switch Patient
                </span>
                {allPatients.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      onSelectPatient(p.id);
                      setShowSwitchMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between transition-colors ${
                      p.id === patient.id
                        ? 'bg-sage-100 text-sage-900'
                        : 'text-ink-800 hover:bg-cream-100'
                    }`}
                  >
                    <span>{p.name}</span>
                    <span className="text-xs text-ink-500 font-normal">{p.region}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Exit / Switch Role */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="p-2.5 rounded-xl border border-borderBase bg-white text-ink-700 hover:bg-cream-200 transition-colors touch-target focus-visible:outline-3"
            title={t('navExit')}
            aria-label={t('navExit')}
          >
            <LogOut className="w-5 h-5 text-ink-700" />
          </button>
        </div>
      </div>
    </header>
  );
};
