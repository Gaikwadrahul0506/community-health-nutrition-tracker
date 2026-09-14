import React, { useState } from 'react';
import { UserProfile, Gender, ActivityLevel, HealthGoal } from '../types';
import { calculateBMI, calculateCalorieNeeds, calculateWaterGoalGlasses } from '../utils/healthCalculators';
import {
  User,
  Save,
  Check,
  RotateCcw,
  Sparkles,
  Activity,
  Droplet,
  Flame,
  Scale,
  ShieldCheck,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface UserProfileViewProps {
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onResetAllData: () => void;
  onExportReport: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  profile,
  onSaveProfile,
  onResetAllData,
  onExportReport
}) => {
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const calculatedBmi = calculateBMI(formData.height, formData.weight);
  const autoCalorieTarget = calculateCalorieNeeds(formData);
  const autoWaterTargetGlasses = calculateWaterGoalGlasses(formData.weight);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...formData,
      customCalorieGoal: formData.customCalorieGoal || autoCalorieTarget,
      customWaterGoalGlasses: formData.customWaterGoalGlasses || autoWaterTargetGlasses
    });
    setSavedSuccess(true);
    confetti({ particleCount: 50, spread: 60 });
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-2xl shadow-md">
              {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-1">
                <User className="w-3 h-3" />
                <span>Personal Health Profile</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {formData.name || 'Community Member'}
              </h1>
              <p className="text-xs text-slate-500">
                {formData.age} years old • {formData.gender} • {formData.weight} kg • {formData.height} cm
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExportReport}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Health Summary</span>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Form & Calculated Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Fields (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Edit Biometric & Target Information
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
            {/* Full Name & Age */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Age (Years) *
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                />
              </div>
            </div>

            {/* Gender, Height & Weight */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Height (cm) *
                </label>
                <input
                  type="number"
                  min="80"
                  max="240"
                  required
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  min="20"
                  max="250"
                  step="0.5"
                  required
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                />
              </div>
            </div>

            {/* Activity Level & Goal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Activity Level
                </label>
                <select
                  value={formData.activityLevel}
                  onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as ActivityLevel })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                >
                  <option value="sedentary">Sedentary (Little or no exercise)</option>
                  <option value="light">Lightly Active (1-3 days/week)</option>
                  <option value="moderate">Moderately Active (3-5 days/week)</option>
                  <option value="active">Active (6-7 days/week)</option>
                  <option value="very_active">Very Active (Physical work / athlete)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Primary Health Goal
                </label>
                <select
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value as HealthGoal })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                >
                  <option value="healthy_lifestyle">Maintain Healthy Lifestyle</option>
                  <option value="weight_loss">Healthy Weight Loss</option>
                  <option value="muscle_gain">Muscle Building & Fitness</option>
                  <option value="manage_health">Cardio & Wellness Management</option>
                </select>
              </div>
            </div>

            {/* Custom Calorie & Water Targets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Daily Calorie Budget (kcal)
                </label>
                <input
                  type="number"
                  min="1000"
                  max="6000"
                  value={formData.customCalorieGoal || autoCalorieTarget}
                  onChange={(e) => setFormData({ ...formData, customCalorieGoal: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Recommended: ~{autoCalorieTarget} kcal/day
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Daily Water Goal (Glasses / 250ml)
                </label>
                <input
                  type="number"
                  min="4"
                  max="20"
                  value={formData.customWaterGoalGlasses || autoWaterTargetGlasses}
                  onChange={(e) => setFormData({ ...formData, customWaterGoalGlasses: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Standard recommendation: {autoWaterTargetGlasses} glasses ({autoWaterTargetGlasses * 250} ml)
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={onResetAllData}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Community Logs</span>
              </button>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                <span>{savedSuccess ? 'Profile Updated!' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Calculated Body Composition (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Health & Metabolic Metrics
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">BMI Category</span>
                  <div className="text-lg font-black text-slate-900 dark:text-white">{calculatedBmi.bmi} kg/m²</div>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${calculatedBmi.badgeBg} ${calculatedBmi.badgeText}`}>
                  {calculatedBmi.category}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">Estimated Caloric Need</span>
                  <div className="text-lg font-black text-slate-900 dark:text-white">{autoCalorieTarget} kcal/day</div>
                </div>
                <Flame className="w-6 h-6 text-amber-600" />
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-blue-800 dark:text-blue-300">Daily Water Target</span>
                  <div className="text-lg font-black text-slate-900 dark:text-white">{autoWaterTargetGlasses} glasses ({autoWaterTargetGlasses * 250} ml)</div>
                </div>
                <Droplet className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Client-Side Privacy</span>
            </div>
            <p>
              Your personal profile and health metrics are saved exclusively in your browser's secure LocalStorage. They are never transmitted or shared without your permission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
