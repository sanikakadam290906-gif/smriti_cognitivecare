import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SOSAlert, SOSAlertStatus } from '../../types';
import { useTranslation } from '../../i18n/LanguageContext';
import { isSupabaseConfigured } from '../../services/supabase/client';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  RotateCw,
  Sparkles,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';

interface CaregiverSOSSectionProps {
  alerts: SOSAlert[];
  loading: boolean;
  onRefresh: () => void;
  onAcknowledge: (id: string) => Promise<void>;
  onResolve: (id: string) => Promise<void>;
  onSimulateDemoAlert?: () => Promise<void>;
}

export const CaregiverSOSSection: React.FC<CaregiverSOSSectionProps> = ({
  alerts,
  loading,
  onRefresh,
  onAcknowledge,
  onResolve,
  onSimulateDemoAlert,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState<'all' | SOSAlertStatus>('all');
  const [showHistory, setShowHistory] = useState<boolean>(true);
  const [resolvingAlertId, setResolvingAlertId] = useState<string | null>(null);
  const [confirmResolveAlert, setConfirmResolveAlert] = useState<SOSAlert | null>(null);
  const [actionInProgressId, setActionInProgressId] = useState<string | null>(null);

  // Helper to format relative time
  const formatTimeAgo = (dateStr: string) => {
    try {
      const now = new Date().getTime();
      const past = new Date(dateStr).getTime();
      const diffMs = now - past;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return t('sosTimeAgoJustNow') || 'Just now';
      if (diffMins < 60) return `${diffMins}${t('sosTimeAgoMinutes') || 'm ago'}`;
      if (diffHours < 24) return `${diffHours}${t('sosTimeAgoHours') || 'h ago'}`;
      return `${diffDays}${t('sosTimeAgoDays') || 'd ago'}`;
    } catch {
      return '';
    }
  };

  // Helper to format exact time
  const formatExactTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' • ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const activeAlerts = alerts.filter((a) => a.status === 'active');
  const unresolvedAlerts = alerts.filter((a) => a.status === 'active' || a.status === 'acknowledged');

  // Filter alerts for the history table
  const filteredAlerts = alerts.filter((a) => {
    if (activeFilter === 'all') return true;
    return a.status === activeFilter;
  });

  const handleAcknowledge = async (id: string) => {
    if (actionInProgressId) return;
    setActionInProgressId(id);
    try {
      await onAcknowledge(id);
    } finally {
      setActionInProgressId(null);
    }
  };

  const handleConfirmResolve = async () => {
    if (!confirmResolveAlert || resolvingAlertId) return;
    setResolvingAlertId(confirmResolveAlert.id);
    try {
      await onResolve(confirmResolveAlert.id);
      setConfirmResolveAlert(null);
    } finally {
      setResolvingAlertId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP ATTENTION: ACTIVE EMERGENCY ALERTS BANNER */}
      {unresolvedAlerts.length > 0 ? (
        <div className="bg-red-50/90 border-2 border-red-300 rounded-3xl p-5 sm:p-7 shadow-card space-y-5 animate-in fade-in">
          {/* Active Banner Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-red-200/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#BE3A34] text-white flex items-center justify-center shrink-0 shadow-xs">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-ink-900 tracking-tight">
                    {t('sosAlertsSectionTitle')}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-extrabold text-xs">
                    {activeAlerts.length} {t('sosActive')}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-ink-600 mt-0.5">
                  Immediate attention required for patient safety.
                </p>
              </div>
            </div>

            {/* Sync Status Badge & Refresh */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-xl border flex items-center gap-1.5 ${
                  isSupabaseConfigured
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-cream-100 text-ink-700 border-borderBase'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSupabaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-sage-600'
                  }`}
                />
                <span>
                  {isSupabaseConfigured ? 'Supabase Realtime Live' : 'Multi-Tab Broadcast'}
                </span>
              </span>

              <button
                type="button"
                onClick={onRefresh}
                title="Refresh alerts"
                disabled={loading}
                className="p-2 rounded-xl bg-white border border-borderBase hover:bg-cream-100 text-ink-700 font-bold transition-colors touch-target focus-visible:outline-3"
              >
                <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Active Alert Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unresolvedAlerts.map((alert) => {
              const isAcknowledged = alert.status === 'acknowledged';
              return (
                <div
                  key={alert.id}
                  className={`rounded-2xl p-5 border-2 shadow-sm flex flex-col justify-between gap-4 transition-all ${
                    isAcknowledged
                      ? 'bg-amber-50/60 border-amber-300'
                      : 'bg-white border-red-300'
                  }`}
                >
                  {/* Card Header: Patient Info & Status Badge */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-xl font-black text-ink-900">
                          {alert.patientName}
                        </h3>
                        {alert.patientRegion && (
                          <span className="text-xs font-bold text-ink-500">
                            {alert.patientRegion}
                          </span>
                        )}
                      </div>

                      {/* Status indicator with explicit text */}
                      <span
                        className={`px-3 py-1 rounded-xl text-xs font-extrabold border uppercase tracking-wider flex items-center gap-1.5 ${
                          isAcknowledged
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-red-100 text-red-900 border-red-300'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isAcknowledged ? 'bg-amber-600' : 'bg-red-600'
                          }`}
                        />
                        {isAcknowledged
                          ? t('sosStatusAcknowledged')
                          : t('sosStatusActive')}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm font-semibold text-ink-700">
                      <div className="flex items-center gap-1.5 text-xs text-ink-500 font-bold">
                        <Clock className="w-4 h-4" />
                        <span>{formatExactTime(alert.createdAt)}</span>
                        <span>({formatTimeAgo(alert.createdAt)})</span>
                      </div>

                      {alert.message && (
                        <p className="text-xs sm:text-sm text-ink-700 mt-1 font-medium bg-cream-50/80 p-2 rounded-xl border border-borderBase/60">
                          {alert.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions for this alert */}
                  <div className="pt-3 border-t border-borderBase/70 flex flex-wrap items-center gap-2">
                    {/* Acknowledge Button (if active) */}
                    {alert.status === 'active' && (
                      <button
                        type="button"
                        onClick={() => handleAcknowledge(alert.id)}
                        disabled={actionInProgressId === alert.id}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm shadow-xs transition-colors touch-target focus-visible:outline-amber-600"
                      >
                        {actionInProgressId === alert.id
                          ? t('sosAcknowledging')
                          : t('sosAcknowledge')}
                      </button>
                    )}

                    {/* Resolve Button */}
                    <button
                      type="button"
                      onClick={() => setConfirmResolveAlert(alert)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-sage-700 hover:bg-sage-800 text-white font-extrabold text-sm shadow-xs transition-colors touch-target"
                    >
                      {t('sosResolve')}
                    </button>

                    {/* View Patient Button */}
                    <button
                      type="button"
                      onClick={() => navigate(`/caregiver/patients/${alert.patientId}`)}
                      title="View patient profile"
                      className="p-2.5 rounded-xl border border-borderBase bg-white hover:bg-cream-100 text-ink-800 font-bold transition-colors touch-target"
                    >
                      <User className="w-4 h-4 text-ink-700" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Standalone header when there are NO active alerts */
        <div className="bg-white border-2 border-borderBase rounded-3xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-sage-100 border border-sage-200 text-sage-800 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-ink-900">
                  {t('sosAlertsSectionTitle')}
                </h2>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                  0 {t('sosActive')}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-ink-500 mt-0.5">
                {t('sosNoActiveAlerts')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {onSimulateDemoAlert && (
              <button
                type="button"
                onClick={onSimulateDemoAlert}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cream-100 hover:bg-cream-200 border border-borderBase text-xs font-bold text-ink-800 transition-colors touch-target"
                title={t('sosSimulateDemoDesc')}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{t('sosSimulateDemoAlert')}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onRefresh}
              title="Refresh"
              disabled={loading}
              className="p-2.5 rounded-xl border border-borderBase bg-white hover:bg-cream-100 text-ink-700 font-bold transition-colors touch-target"
            >
              <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      )}

      {/* 2. ALERT HISTORY SECTION (Collapsible & Filterable) */}
      <div className="bg-white border-2 border-borderBase rounded-3xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between cursor-pointer select-none" onClick={() => setShowHistory(!showHistory)}>
          <div className="flex items-center gap-2">
            <h3 className="text-lg sm:text-xl font-bold text-ink-900">
              {t('sosAlertHistory')}
            </h3>
            <span className="text-xs bg-cream-200 text-ink-700 px-2 py-0.5 rounded-full font-bold">
              {alerts.length}
            </span>
          </div>

          <button
            type="button"
            className="p-1 text-ink-500 hover:text-ink-800"
            aria-label="Toggle alert history"
          >
            {showHistory ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {showHistory && (
          <div className="space-y-4 pt-2">
            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {(['all', 'active', 'acknowledged', 'resolved'] as const).map((filterKey) => (
                <button
                  key={filterKey}
                  type="button"
                  onClick={() => setActiveFilter(filterKey)}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeFilter === filterKey
                      ? 'bg-sage-700 text-white shadow-xs'
                      : 'bg-cream-100 text-ink-700 hover:bg-cream-200 border border-borderBase'
                  }`}
                >
                  {filterKey === 'all'
                    ? t('sosFilterAll')
                    : filterKey === 'active'
                    ? t('sosFilterActive')
                    : filterKey === 'acknowledged'
                    ? t('sosFilterAcknowledged')
                    : t('sosFilterResolved')}
                </button>
              ))}
            </div>

            {/* Alert items list */}
            {filteredAlerts.length === 0 ? (
              <div className="p-8 text-center text-ink-500 text-sm font-semibold bg-cream-50 rounded-2xl border border-borderBase/60">
                No alerts match the selected filter.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAlerts.map((alert) => {
                  const statusColors = {
                    active: 'bg-red-50 text-red-900 border-red-200',
                    acknowledged: 'bg-amber-50 text-amber-900 border-amber-200',
                    resolved: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                    cancelled: 'bg-cream-100 text-ink-600 border-borderBase',
                  };

                  return (
                    <div
                      key={alert.id}
                      className="p-4 rounded-2xl border border-borderBase bg-cream-50/50 hover:bg-cream-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-base text-ink-900">
                            {alert.patientName}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border uppercase tracking-wider ${
                              statusColors[alert.status]
                            }`}
                          >
                            {alert.status === 'active'
                              ? t('sosStatusActive')
                              : alert.status === 'acknowledged'
                              ? t('sosStatusAcknowledged')
                              : alert.status === 'resolved'
                              ? t('sosStatusResolved')
                              : alert.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-ink-500 font-semibold flex-wrap">
                          <span>{t('sosPatientNotifiedAt')}: {formatExactTime(alert.createdAt)}</span>
                          {alert.acknowledgedAt && (
                            <span>• {t('sosAcknowledgedAt')}: {formatExactTime(alert.acknowledgedAt)}</span>
                          )}
                          {alert.resolvedAt && (
                            <span>• {t('sosResolvedAt')}: {formatExactTime(alert.resolvedAt)}</span>
                          )}
                        </div>
                      </div>

                      {/* Link to patient */}
                      <button
                        type="button"
                        onClick={() => navigate(`/caregiver/patients/${alert.patientId}`)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-sage-700 hover:text-sage-800 hover:underline self-start sm:self-center"
                      >
                        <span>{t('openPatientCare')}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. RESOLVE CONFIRMATION DIALOG */}
      {confirmResolveAlert && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="resolve-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/50 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-white border-2 border-borderBase rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-300 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3
                id="resolve-modal-title"
                className="text-xl sm:text-2xl font-black text-ink-900"
              >
                {t('sosConfirmResolveTitle')}
              </h3>
              <p className="text-sm font-semibold text-ink-600 mt-2">
                Patient: <span className="font-bold text-ink-900">{confirmResolveAlert.patientName}</span>
              </p>
              <p className="text-xs text-ink-500 mt-1">
                {t('sosConfirmResolveDesc')}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmResolveAlert(null)}
                className="flex-1 py-3 px-4 rounded-xl border border-borderBase bg-cream-100 hover:bg-cream-200 text-ink-800 font-bold text-sm transition-colors touch-target"
              >
                {t('sosConfirmCancel')}
              </button>

              <button
                type="button"
                onClick={handleConfirmResolve}
                disabled={Boolean(resolvingAlertId)}
                className="flex-1 py-3 px-4 rounded-xl bg-sage-700 hover:bg-sage-800 text-white font-extrabold text-sm transition-colors shadow-sm touch-target"
              >
                {resolvingAlertId ? t('sosResolving') : t('sosConfirmResolveYes')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
