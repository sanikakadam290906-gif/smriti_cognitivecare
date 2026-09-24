import React, { useState, useEffect, useRef } from 'react';
import { Patient, SOSAlert } from '../../types';
import { useTranslation } from '../../i18n/LanguageContext';
import { dataService } from '../../services/supabase/dataService';
import { isSupabaseConfigured } from '../../services/supabase/client';
import { AlertCircle, CheckCircle2, XCircle, Loader2, PhoneCall } from 'lucide-react';

interface PatientSOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onAlertCreated?: (alert: SOSAlert) => void;
}

type ModalState = 'confirm' | 'sending' | 'success' | 'error';

export const PatientSOSModal: React.FC<PatientSOSModalProps> = ({
  isOpen,
  onClose,
  patient,
  onAlertCreated,
}) => {
  const { t } = useTranslation();
  const [modalState, setModalState] = useState<ModalState>('confirm');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  // Reset state whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      setModalState('confirm');
      setErrorMessage('');
      // Elderly-friendly accessibility: Focus the Cancel button first to prevent accidental Enter press
      setTimeout(() => {
        cancelButtonRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Handle escape key to cancel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape' && modalState !== 'sending') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, modalState, onClose]);

  if (!isOpen) return null;

  const handleSendSOS = async () => {
    if (modalState === 'sending') return; // Prevent double submission
    setModalState('sending');
    setErrorMessage('');

    try {
      const createdAlert = await dataService.createSosAlert({
        patientId: patient.id,
        message: `Emergency SOS triggered by ${patient.name} (${patient.region})`,
      });

      setModalState('success');
      if (onAlertCreated) {
        onAlertCreated(createdAlert);
      }
    } catch (err: any) {
      console.error('Failed to dispatch SOS alert:', err);
      setErrorMessage(
        t('sosErrorMessage') ||
          'Your alert could not be sent. Please try again or ask someone nearby for help.'
      );
      setModalState('error');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sos-dialog-title"
      aria-describedby="sos-dialog-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm animate-in fade-in"
    >
      <div className="bg-white border-2 border-borderBase rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-center">
        {/* CONFIRMATION STATE */}
        {modalState === 'confirm' && (
          <div className="space-y-6">
            <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-300 text-red-700 mx-auto flex items-center justify-center">
              <PhoneCall className="w-10 h-10" />
            </div>

            <div>
              <h2
                id="sos-dialog-title"
                className="text-2xl sm:text-3xl font-black text-ink-900 leading-tight"
              >
                {t('sosConfirmTitle')}
              </h2>
              <p
                id="sos-dialog-desc"
                className="text-base sm:text-lg font-bold text-ink-600 mt-2"
              >
                {t('sosConfirmSubtitle')}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleSendSOS}
                className="w-full min-h-[58px] py-4 px-6 rounded-2xl bg-[#BE3A34] hover:bg-[#A82F2A] active:bg-[#8F2722] text-white font-extrabold text-lg sm:text-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-3 touch-target"
              >
                <AlertCircle className="w-6 h-6" />
                <span>{t('sosConfirmYes')}</span>
              </button>

              <button
                ref={cancelButtonRef}
                type="button"
                onClick={onClose}
                className="w-full min-h-[54px] py-3.5 px-6 rounded-2xl bg-cream-100 hover:bg-cream-200 border-2 border-borderBase text-ink-800 font-bold text-lg transition-colors touch-target"
              >
                {t('sosConfirmCancel')}
              </button>
            </div>
          </div>
        )}

        {/* SENDING STATE */}
        {modalState === 'sending' && (
          <div className="py-6 space-y-5">
            <div className="w-20 h-20 rounded-full bg-amber-50 border-2 border-amber-300 text-amber-600 mx-auto flex items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>

            <div>
              <h2
                id="sos-dialog-title"
                className="text-2xl font-black text-ink-900"
              >
                {t('sosSending')}
              </h2>
              <p
                id="sos-dialog-desc"
                className="text-base font-bold text-ink-500 mt-1"
              >
                Connecting with caregiver network...
              </p>
            </div>
          </div>
        )}

        {/* SUCCESS STATE */}
        {modalState === 'success' && (
          <div className="space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-400 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <h2
                id="sos-dialog-title"
                className="text-2xl sm:text-3xl font-black text-emerald-900 leading-snug"
              >
                {isSupabaseConfigured
                  ? t('sosSuccessMessage')
                  : t('sosSuccessDemoMessage')}
              </h2>
              <p
                id="sos-dialog-desc"
                className="text-base font-semibold text-ink-600 mt-2"
              >
                Please stay in a safe place. Help is being arranged.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full min-h-[56px] py-3.5 px-6 rounded-2xl bg-sage-700 hover:bg-sage-800 text-white font-extrabold text-lg transition-colors shadow-sm touch-target"
            >
              {t('sosClose')}
            </button>
          </div>
        )}

        {/* ERROR STATE */}
        {modalState === 'error' && (
          <div className="space-y-6">
            <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-300 text-red-600 mx-auto flex items-center justify-center">
              <XCircle className="w-12 h-12" />
            </div>

            <div>
              <h2
                id="sos-dialog-title"
                className="text-2xl font-black text-red-900"
              >
                Alert Failed
              </h2>
              <p
                id="sos-dialog-desc"
                className="text-base font-bold text-ink-700 mt-2 leading-relaxed"
              >
                {errorMessage}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleSendSOS}
                className="w-full min-h-[56px] py-3.5 px-6 rounded-2xl bg-[#BE3A34] hover:bg-[#A82F2A] text-white font-extrabold text-lg shadow-sm transition-colors touch-target"
              >
                {t('sosTryAgain')}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full min-h-[52px] py-3 px-6 rounded-2xl bg-cream-100 hover:bg-cream-200 border border-borderBase text-ink-800 font-bold text-base transition-colors touch-target"
              >
                {t('sosClose')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
