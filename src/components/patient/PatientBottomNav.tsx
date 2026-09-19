import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Sparkles, Pill, CalendarCheck } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

export const PatientBottomNav: React.FC = () => {
  const { t } = useTranslation();

  const navItems = [
    { to: '/patient/home', label: t('navHome'), icon: Home },
    { to: '/patient/games', label: t('navGames'), icon: Sparkles },
    { to: '/patient/medicines', label: t('navMedicines'), icon: Pill },
    { to: '/patient/routine', label: t('navRoutine'), icon: CalendarCheck },
  ];

  return (
    <nav
      aria-label="Patient navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-cream-50/95 backdrop-blur-md border-t-2 border-borderBase px-2 py-2 safe-area-pb"
    >
      <div className="max-w-xl mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-xl transition-all touch-target focus-visible:outline-3 focus-visible:outline-sage-600 ${
                  isActive
                    ? 'text-sage-800 bg-sage-100 font-extrabold shadow-xs'
                    : 'text-ink-700 hover:text-ink-900 font-semibold'
                }`
              }
            >
              <Icon className="w-6 h-6 sm:w-7 sm:h-7 mb-1" />
              <span className="text-xs sm:text-sm tracking-wide line-clamp-1">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
