import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

export const MedicalDisclaimer: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { t } = useTranslation();

  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-lg border border-borderBase bg-cream-50 text-ink-700 text-sm leading-relaxed ${className}`}>
      <ShieldAlert className="w-4 h-4 text-ink-500 mt-0.5 shrink-0" />
      <p>{t('disclaimer')}</p>
    </div>
  );
};
