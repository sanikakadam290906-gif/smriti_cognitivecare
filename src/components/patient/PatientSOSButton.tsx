import React, { useState } from 'react';
import { Patient, SOSAlert } from '../../types';
import { useTranslation } from '../../i18n/LanguageContext';
import { PatientSOSModal } from './PatientSOSModal';
import { PhoneCall } from 'lucide-react';

interface PatientSOSButtonProps {
  patient: Patient;
  className?: string;
  variant?: 'header' | 'banner';
  onAlertCreated?: (alert: SOSAlert) => void;
}

export const PatientSOSButton: React.FC<PatientSOSButtonProps> = ({
  patient,
  className = '',
  variant = 'header',
  onAlertCreated,
}) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (variant === 'banner') {
    return (
      <>
        <div
          className={`bg-red-50/80 border-2 border-red-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${className}`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#BE3A34] text-white flex items-center justify-center shrink-0 shadow-xs">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-ink-900 leading-tight">
                {t('sosNeedImmediateHelp')}
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-ink-600 mt-0.5">
                {t('sosTapToAlertCaregiver')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            aria-label={t('sosAriaLabel')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#BE3A34] hover:bg-[#A82F2A] active:bg-[#8F2722] text-white font-black text-base sm:text-lg shadow-sm transition-all active:scale-98 touch-target focus-visible:outline-red-600"
          >
            <PhoneCall className="w-5 h-5 text-white" />
            <span>{t('sosNeedHelp')}</span>
          </button>
        </div>

        <PatientSOSModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          patient={patient}
          onAlertCreated={onAlertCreated}
        />
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        aria-label={t('sosAriaLabel')}
        title={t('sosAriaLabel')}
        className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#BE3A34] hover:bg-[#A82F2A] active:bg-[#8F2722] text-white font-black transition-all active:scale-95 touch-target shadow-xs focus-visible:outline-red-700 ${className}`}
      >
        <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" />
        <span className="text-sm sm:text-base tracking-wider font-black">
          {t('sos')}
        </span>
        <span className="hidden md:inline text-xs font-bold opacity-90">
          • Need Help?
        </span>
      </button>

      <PatientSOSModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patient={patient}
        onAlertCreated={onAlertCreated}
      />
    </>
  );
};
