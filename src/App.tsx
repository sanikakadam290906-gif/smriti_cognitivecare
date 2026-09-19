import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LanguageProvider, useTranslation } from './i18n/LanguageContext';
import { dataService } from './services/supabase/dataService';
import { Patient, Language } from './types';

// Layouts
import { CaregiverSidebar } from './components/caregiver/CaregiverSidebar';
import { PatientHeader } from './components/patient/PatientHeader';
import { PatientBottomNav } from './components/patient/PatientBottomNav';

// Pages
import { LandingPage } from './pages/LandingPage';
import { CaregiverDashboard } from './pages/caregiver/CaregiverDashboard';
import { PatientListPage } from './pages/caregiver/PatientListPage';
import { PatientDetailPage } from './pages/caregiver/PatientDetailPage';
import { CarePlanPage } from './pages/caregiver/CarePlanPage';
import { PatientProgressPage } from './pages/caregiver/PatientProgressPage';
import { CaregiverSettingsPage } from './pages/caregiver/CaregiverSettingsPage';

import { PatientHomePage } from './pages/patient/PatientHomePage';
import { PatientGamesMenuPage } from './pages/patient/PatientGamesMenuPage';
import { PatientMedicinesPage } from './pages/patient/PatientMedicinesPage';
import { PatientRoutinePage } from './pages/patient/PatientRoutinePage';

// Games
import { MemoryMatchGame } from './games/memory/MemoryMatchGame';
import { FindObjectGame } from './games/findObject/FindObjectGame';
import { PatternGame } from './games/pattern/PatternGame';
import { RoutineRecallGame } from './games/routine/RoutineRecallGame';

// Caregiver App Wrapper
const CaregiverLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream-100 flex flex-col md:flex-row">
      <CaregiverSidebar />
      <main className="flex-1 overflow-y-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

// Patient App Wrapper
const PatientLayout: React.FC<{
  activePatient: Patient | null;
  patients: Patient[];
  onSelectPatient: (id: string) => void;
}> = ({ activePatient, patients, onSelectPatient }) => {
  if (!activePatient) {
    return <div className="p-8 text-center text-ink-700">Loading patient...</div>;
  }

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col justify-between selection:bg-sage-200">
      <PatientHeader
        patient={activePatient}
        allPatients={patients}
        onSelectPatient={onSelectPatient}
      />
      <main className="flex-1">
        <Outlet />
      </main>
      <PatientBottomNav />
    </div>
  );
};

export const AppContent: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [activePatientId, setActivePatientId] = useState<string>(() => {
    return localStorage.getItem('smriti_active_patient_id') || 'patient-asha-devi';
  });
  const [loading, setLoading] = useState(true);
  const { setLanguage } = useTranslation();

  useEffect(() => {
    loadPatients();

    const unsubscribe = dataService.subscribe(() => {
      loadPatients();
    });

    return () => unsubscribe();
  }, []);

  const loadPatients = async () => {
    const pts = await dataService.getPatients();
    setPatients(pts);
    setLoading(false);
  };

  const handleSelectPatient = (id: string) => {
    setActivePatientId(id);
    localStorage.setItem('smriti_active_patient_id', id);

    const targetPatient = patients.find((p) => p.id === id);
    if (targetPatient) {
      setLanguage(targetPatient.language);
    }
  };

  const activePatient =
    patients.find((p) => p.id === activePatientId) || patients[0] || null;

  useEffect(() => {
    if (activePatient && window.location.pathname.startsWith('/patient')) {
      setLanguage(activePatient.language);
    }
  }, [activePatient?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center text-ink-700 font-bold">
        Loading Smriti...
      </div>
    );
  }

  return (
    <Routes>
      {/* Landing Page */}
      <Route
        path="/"
        element={
          <LandingPage
            patients={patients}
            onSelectPatient={handleSelectPatient}
          />
        }
      />

      {/* Caregiver Routes */}
      <Route path="/caregiver" element={<CaregiverLayout />}>
        <Route index element={<Navigate to="/caregiver/dashboard" replace />} />
        <Route path="dashboard" element={<CaregiverDashboard />} />
        <Route path="patients" element={<PatientListPage />} />
        <Route path="patients/:patientId" element={<PatientDetailPage />} />
        <Route path="patients/:patientId/care-plan" element={<CarePlanPage />} />
        <Route path="patients/:patientId/progress" element={<PatientProgressPage />} />
        <Route
          path="care-plans"
          element={
            <Navigate
              to={`/caregiver/patients/${activePatient ? activePatient.id : 'patient-asha-devi'}/care-plan`}
              replace
            />
          }
        />
        <Route
          path="progress"
          element={
            <Navigate
              to={`/caregiver/patients/${activePatient ? activePatient.id : 'patient-asha-devi'}/progress`}
              replace
            />
          }
        />
        <Route path="settings" element={<CaregiverSettingsPage />} />
      </Route>

      {/* Patient Routes */}
      <Route
        path="/patient"
        element={
          <PatientLayout
            activePatient={activePatient}
            patients={patients}
            onSelectPatient={handleSelectPatient}
          />
        }
      >
        <Route index element={<Navigate to="/patient/home" replace />} />
        <Route
          path="home"
          element={activePatient ? <PatientHomePage patient={activePatient} /> : null}
        />
        <Route
          path="games"
          element={
            activePatient ? (
              <PatientGamesMenuPage difficulty={activePatient.currentDifficulty} />
            ) : null
          }
        />
        <Route
          path="games/memory"
          element={
            activePatient ? (
              <MemoryMatchGame
                patientId={activePatient.id}
                difficulty={activePatient.currentDifficulty}
              />
            ) : null
          }
        />
        <Route
          path="games/find-object"
          element={
            activePatient ? (
              <FindObjectGame
                patientId={activePatient.id}
                difficulty={activePatient.currentDifficulty}
              />
            ) : null
          }
        />
        <Route
          path="games/pattern"
          element={
            activePatient ? (
              <PatternGame
                patientId={activePatient.id}
                difficulty={activePatient.currentDifficulty}
              />
            ) : null
          }
        />
        <Route
          path="games/routine"
          element={
            activePatient ? (
              <RoutineRecallGame
                patientId={activePatient.id}
                difficulty={activePatient.currentDifficulty}
              />
            ) : null
          }
        />
        <Route
          path="medicines"
          element={activePatient ? <PatientMedicinesPage patient={activePatient} /> : null}
        />
        <Route
          path="routine"
          element={activePatient ? <PatientRoutinePage patient={activePatient} /> : null}
        />
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </BrowserRouter>
  );
}
