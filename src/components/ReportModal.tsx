import React from 'react';
import { UserProfile, DayRecord } from '../types';
import { calculateBMI } from '../utils/healthCalculators';
import { X, Printer, Download, HeartPulse, CheckCircle2, Award, Calendar } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  todayRecord: DayRecord;
  calorieBudget: number;
  waterGoalGlasses: number;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  profile,
  todayRecord,
  calorieBudget,
  waterGoalGlasses
}) => {
  if (!isOpen) return null;

  const bmiResult = calculateBMI(profile?.height || 170, profile?.weight || 65);
  const totalCaloriesEaten = (todayRecord?.meals || []).reduce((sum, m) => sum + (m.calories || 0), 0);
  const totalExerciseBurned = (todayRecord?.exercises || []).reduce((sum, e) => sum + (e.caloriesBurned || 0), 0);
  const totalExerciseMins = (todayRecord?.exercises || []).reduce((sum, e) => sum + (e.durationMinutes || 0), 0);
  const waterGlasses = Math.round((todayRecord?.waterTotalMl || 0) / 250);

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(
      {
        project: 'Community Engagement Project (CEP) - Nutrition & Health Tracker',
        generatedAt: new Date().toISOString(),
        profile,
        todayRecord,
        bmiResult
      },
      null,
      2
    );
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CEP-Health-Report-${profile.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 my-8 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                CEP Project Health Dossier
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Nutritional & Lifestyle Evaluation
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Report Document Body */}
        <div id="printable-report" className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-wrap justify-between gap-3">
            <div>
              <p className="text-[11px] text-slate-500 font-semibold">PARTICIPANT NAME</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{profile.name}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-semibold">AGE & GENDER</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{profile.age} yrs • {profile.gender}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-semibold">HEIGHT & WEIGHT</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{profile.height} cm • {profile.weight} kg</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-semibold">REPORT DATE</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Biometrics Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 block">BMI Score</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white">{bmiResult.bmi} kg/m²</span>
              <span className="text-[10px] font-bold block text-emerald-600">{bmiResult.category}</span>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 block">Calories Eaten</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white">{totalCaloriesEaten} kcal</span>
              <span className="text-[10px] text-slate-500">Budget: {calorieBudget}</span>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 block">Hydration</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white">{waterGlasses} glasses</span>
              <span className="text-[10px] text-blue-600">{todayRecord.waterTotalMl || 0} ml</span>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 block">Active Movement</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white">{totalExerciseMins} mins</span>
              <span className="text-[10px] text-rose-600">-{totalExerciseBurned} kcal</span>
            </div>
          </div>

          {/* Meals Logged */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              Today's Logged Meals ({todayRecord.meals.length} items)
            </h4>
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 max-h-36 overflow-y-auto">
              {todayRecord.meals.length === 0 ? (
                <div className="p-3 text-center text-slate-400">No meals logged for today.</div>
              ) : (
                todayRecord.meals.map((m) => (
                  <div key={m.id} className="p-2.5 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{m.name}</span>
                      <span className="text-slate-400 capitalize ml-2">({m.mealType})</span>
                    </div>
                    <span className="font-bold text-emerald-600">{m.calories} kcal</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* CEP Project Accreditation */}
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300">
            <strong>Community Engagement Project Accreditation:</strong> Verified community digital tracking report. Designed for public health awareness and lifestyle improvement.
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleExportJSON}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download JSON</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
