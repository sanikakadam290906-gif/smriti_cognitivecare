import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, HeartHandshake, TrendingUp, Settings, LogOut, Activity } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

export const CaregiverSidebar: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const links = [
    { to: '/caregiver/dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { to: '/caregiver/patients', label: t('navPatients'), icon: Users },
    { to: '/caregiver/care-plans', label: t('navCarePlans'), icon: HeartHandshake },
    { to: '/caregiver/progress', label: t('navProgress'), icon: TrendingUp },
    { to: '/caregiver/settings', label: t('navSettings'), icon: Settings },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-borderBase flex flex-col justify-between shrink-0 select-none">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-borderBase flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sage-700 text-white flex items-center justify-center font-extrabold text-lg shadow-subtle">
              S
            </div>
            <div>
              <span className="block font-black text-lg tracking-wider text-ink-900 leading-none">
                SMRITI
              </span>
              <span className="text-xs text-ink-500 font-semibold tracking-wide">
                Cognitive Care
              </span>
            </div>
          </div>
          <span className="text-xs bg-sage-50 text-sage-800 border border-sage-200 px-2 py-0.5 rounded font-bold">
            Caregiver
          </span>
        </div>

        {/* Navigation links */}
        <nav className="p-3 space-y-1.5" aria-label="Caregiver navigation">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-xl font-bold text-base transition-colors ${
                    isActive
                      ? 'bg-sage-100 text-sage-800 shadow-xs'
                      : 'text-ink-700 hover:bg-cream-100 hover:text-ink-900'
                  }`
                }
              >
                <Icon className="w-5 h-5 text-current" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / Exit */}
      <div className="p-4 border-t border-borderBase">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-ink-700 hover:bg-cream-200 hover:text-ink-900 transition-colors"
        >
          <LogOut className="w-5 h-5 text-ink-500" />
          <span>{t('navExit')}</span>
        </button>
      </div>
    </aside>
  );
};
