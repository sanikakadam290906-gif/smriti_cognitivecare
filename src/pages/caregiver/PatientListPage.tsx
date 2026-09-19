import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Patient, Language, DifficultyLevel } from '../../types';
import { dataService } from '../../services/supabase/dataService';
import { useTranslation } from '../../i18n/LanguageContext';
import { Button } from '../../components/ui/Button';
import { UserPlus, Edit2, ChevronRight, X } from 'lucide-react';

export const PatientListPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [age, setAge] = useState(70);
  const [region, setRegion] = useState('Assam');
  const [language, setLanguage] = useState<Language>('as');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    const data = await dataService.getPatients();
    setPatients(data);
    setLoading(false);
  };

  const handleOpenAdd = () => {
    setEditingPatient(null);
    setName('');
    setAge(70);
    setRegion('Assam');
    setLanguage('as');
    setDifficulty('Medium');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (patient: Patient, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPatient(patient);
    setName(patient.name);
    setAge(patient.age);
    setRegion(patient.region);
    setLanguage(patient.language);
    setDifficulty(patient.currentDifficulty);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingPatient) {
      await dataService.updatePatient(editingPatient.id, {
        name,
        age: Number(age),
        region,
        language,
        currentDifficulty: difficulty,
      });
    } else {
      await dataService.addPatient({
        name,
        age: Number(age),
        region,
        language,
        currentDifficulty: difficulty,
      });
    }

    setIsModalOpen(false);
    await loadPatients();
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-borderBase pb-6">
        <div>
          <span className="text-sm font-bold text-sage-700 uppercase tracking-wider">
            Patient Profiles
          </span>
          <h1 className="text-3xl font-black text-ink-900 tracking-tight">
            {t('navPatients')}
          </h1>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenAdd}
          className="gap-2"
        >
          <UserPlus className="w-5 h-5" />
          <span>Add New Patient</span>
        </Button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-ink-500">{t('loading')}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((patient) => (
            <div
              key={patient.id}
              onClick={() => navigate(`/caregiver/patients/${patient.id}`)}
              className="bg-white border-2 border-borderBase hover:border-sage-500 rounded-3xl p-6 shadow-card hover:shadow-md transition-all cursor-pointer flex flex-col justify-between select-none"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-2xl font-extrabold text-ink-900">
                      {patient.name}
                    </h3>
                    <span className="text-sm font-bold text-ink-500">
                      {patient.age} years old • {patient.region}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleOpenEdit(patient, e)}
                    className="p-2 rounded-xl border border-borderBase hover:bg-cream-200 text-ink-700 transition-colors"
                    title="Edit Patient"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 pt-3 border-t border-borderBase/60 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ink-500 font-semibold">Language:</span>
                    <span className="font-bold text-ink-900">
                      {patient.language === 'as' ? 'Assamese' : patient.language === 'lus' ? 'Mizo' : 'English'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-500 font-semibold">Current Difficulty:</span>
                    <span className="font-bold text-sage-800 bg-sage-50 px-2 py-0.5 rounded border border-sage-200">
                      {patient.currentDifficulty}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-borderBase/60 flex items-center justify-between text-sm font-bold text-sage-700">
                <span>View Care Dashboard</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Patient Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-xs">
          <div className="bg-white border-2 border-borderBase rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-lg animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-borderBase">
              <h2 className="text-xl font-bold text-ink-900">
                {editingPatient ? 'Edit Patient' : 'Add New Patient'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-ink-400 hover:text-ink-900"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-ink-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-borderBase focus:border-sage-600 outline-hidden font-semibold text-ink-900"
                  placeholder="e.g. Asha Devi"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-ink-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    min={40}
                    max={110}
                    required
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-borderBase focus:border-sage-600 outline-hidden font-semibold text-ink-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-ink-700 mb-1">
                    Region
                  </label>
                  <input
                    type="text"
                    required
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-borderBase focus:border-sage-600 outline-hidden font-semibold text-ink-900"
                    placeholder="e.g. Assam"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-ink-700 mb-1">
                  Language (Strictly 3 Supported)
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-borderBase focus:border-sage-600 outline-hidden font-semibold text-ink-900 bg-white"
                >
                  <option value="en">English</option>
                  <option value="as">Assamese (অসমীয়া)</option>
                  <option value="lus">Mizo (Mizo ṭawng)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-ink-700 mb-1">
                  Initial Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-borderBase focus:border-sage-600 outline-hidden font-semibold text-ink-900 bg-white"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-borderBase">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1">
                  Save Patient
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
