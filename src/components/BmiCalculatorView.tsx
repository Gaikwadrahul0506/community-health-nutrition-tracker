import React, { useState } from 'react';
import { UserProfile, BmiCalculationRecord } from '../types';
import { calculateBMI } from '../utils/healthCalculators';
import {
  Scale,
  Sparkles,
  Save,
  Check,
  HeartPulse,
  CheckCircle2,
  Clock,
  Trash2,
  History,
  TrendingDown,
  TrendingUp,
  Activity
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BmiCalculatorViewProps {
  profile: UserProfile;
  bmiHistory: BmiCalculationRecord[];
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onSaveBmiRecord: (record: BmiCalculationRecord) => void;
  onDeleteBmiRecord: (recordId: string) => void;
}

export const BmiCalculatorView: React.FC<BmiCalculatorViewProps> = ({
  profile,
  bmiHistory,
  onUpdateProfile,
  onSaveBmiRecord,
  onDeleteBmiRecord
}) => {
  const [unitMode, setUnitMode] = useState<'metric' | 'imperial'>('metric');
  const [heightCm, setHeightCm] = useState<number>(profile.height || 172);
  const [weightKg, setWeightKg] = useState<number>(profile.weight || 68);

  // Imperial inputs state
  const [heightFt, setHeightFt] = useState<number>(Math.floor(heightCm / 30.48) || 5);
  const [heightIn, setHeightIn] = useState<number>(Math.round((heightCm % 30.48) / 2.54) || 8);
  const [weightLbs, setWeightLbs] = useState<number>(Math.round(weightKg * 2.20462) || 150);

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Effective measurements
  const effectiveHeightCm = unitMode === 'metric' ? heightCm : Math.round((heightFt * 12 + heightIn) * 2.54);
  const effectiveWeightKg = unitMode === 'metric' ? weightKg : Math.round(weightLbs / 2.20462 * 10) / 10;

  const bmiResult = calculateBMI(effectiveHeightCm, effectiveWeightKg);

  const handleImperialHeightChange = (ft: number, inch: number) => {
    setHeightFt(ft);
    setHeightIn(inch);
    setHeightCm(Math.round((ft * 12 + inch) * 2.54));
  };

  const handleImperialWeightChange = (lbs: number) => {
    setWeightLbs(lbs);
    setWeightKg(Math.round(lbs / 2.20462 * 10) / 10);
  };

  const handleSaveToProfile = () => {
    onUpdateProfile({
      height: effectiveHeightCm,
      weight: effectiveWeightKg
    });

    const newRecord: BmiCalculationRecord = {
      id: `bmi-${Date.now()}`,
      height: effectiveHeightCm,
      weight: effectiveWeightKg,
      bmi: bmiResult.bmi,
      category: bmiResult.category,
      timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
    };

    onSaveBmiRecord(newRecord);
    setSavedSuccess(true);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // BMI Position on 10 to 40 scale
  const gaugePercent = Math.min(100, Math.max(0, ((bmiResult.bmi - 10) / 30) * 100));

  return (
    <div className="space-y-8">
      {/* Header in Frosted Glass */}
      <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-950 dark:text-emerald-300 text-xs font-black border border-emerald-500/30 mb-2 shadow-xs">
              <Scale className="w-3.5 h-3.5 text-emerald-600" />
              <span>WHO Standardized Body Mass Index Assessment</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
              BMI Health Calculator & History
            </h1>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">
              Calculate Body Mass Index, target healthy weight ranges, and keep track of your longitudinal progress.
            </p>
          </div>

          {/* Unit Switcher */}
          <div className="flex items-center bg-white/60 dark:bg-white/10 p-1 rounded-2xl self-start sm:self-auto border border-white/60 dark:border-white/10 backdrop-blur-md">
            <button
              onClick={() => setUnitMode('metric')}
              className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                unitMode === 'metric'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950'
              }`}
            >
              Metric (cm / kg)
            </button>
            <button
              onClick={() => setUnitMode('imperial')}
              className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                unitMode === 'imperial'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950'
              }`}
            >
              Imperial (ft-in / lbs)
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs + Result Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl space-y-6">
          <h3 className="text-base font-black text-slate-950 dark:text-white">
            Enter Your Body Measurements
          </h3>

          {unitMode === 'metric' ? (
            <div className="space-y-6">
              {/* Height in CM */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Height (cm)
                  </label>
                  <span className="text-sm font-black text-emerald-800 dark:text-emerald-400">
                    {heightCm} cm <span className="text-xs font-normal text-slate-500">({(heightCm / 100).toFixed(2)} m)</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="220"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <input
                  type="number"
                  min="80"
                  max="250"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="mt-3 w-full px-4 py-2.5 rounded-2xl bg-white/60 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-bold"
                />
              </div>

              {/* Weight in KG */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Weight (kg)
                  </label>
                  <span className="text-sm font-black text-emerald-800 dark:text-emerald-400">
                    {weightKg} kg
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="160"
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <input
                  type="number"
                  min="20"
                  max="250"
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="mt-3 w-full px-4 py-2.5 rounded-2xl bg-white/60 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-bold"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Height in Feet & Inches */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2">
                  Height (Feet & Inches)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Feet</span>
                    <input
                      type="number"
                      min="3"
                      max="7"
                      value={heightFt}
                      onChange={(e) => handleImperialHeightChange(Number(e.target.value), heightIn)}
                      className="w-full px-3 py-2 rounded-2xl bg-white/60 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Inches</span>
                    <input
                      type="number"
                      min="0"
                      max="11"
                      value={heightIn}
                      onChange={(e) => handleImperialHeightChange(heightFt, Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-2xl bg-white/60 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Weight in Lbs */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2">
                  Weight (Pounds / lbs)
                </label>
                <input
                  type="number"
                  min="60"
                  max="450"
                  value={weightLbs}
                  onChange={(e) => handleImperialWeightChange(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/60 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-xs font-bold"
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleSaveToProfile}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? 'Saved to Profile & History!' : 'Save Calculation to History'}</span>
            </button>
          </div>
        </div>

        {/* Right BMI Score & Gauge (7 cols) */}
        <div className="lg:col-span-7 bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  Calculated Result
                </span>
                <div className="text-4xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tight mt-1">
                  {bmiResult.bmi} <span className="text-base font-bold text-slate-400">kg/m²</span>
                </div>
              </div>

              <div className={`px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-wider ${bmiResult.badgeBg} ${bmiResult.badgeText} border border-current shadow-xs`}>
                {bmiResult.category}
              </div>
            </div>

            {/* Visual Color-Coded BMI Spectrum Gauge */}
            <div className="space-y-2 pt-2">
              <div className="relative h-4 rounded-full bg-gradient-to-r from-blue-400 via-emerald-400 via-amber-400 to-rose-500 overflow-hidden shadow-inner" />

              {/* Indicator Arrow */}
              <div className="relative w-full h-4">
                <div
                  style={{ left: `${gaugePercent}%` }}
                  className="absolute -top-1 -translate-x-1/2 flex flex-col items-center transition-all duration-500"
                >
                  <div className="w-3.5 h-3.5 bg-slate-900 dark:bg-white rounded-full border-2 border-white dark:border-slate-900 shadow-md" />
                </div>
              </div>

              {/* Range Legends */}
              <div className="grid grid-cols-4 text-center text-[10px] sm:text-xs font-bold text-slate-500 pt-1">
                <div className="text-blue-600 dark:text-blue-400">Underweight<br />(&lt; 18.5)</div>
                <div className="text-emerald-600 dark:text-emerald-400">Normal<br />(18.5 - 24.9)</div>
                <div className="text-amber-600 dark:text-amber-400">Overweight<br />(25.0 - 29.9)</div>
                <div className="text-rose-600 dark:text-rose-400">Obese<br />(&ge; 30.0)</div>
              </div>
            </div>

            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed bg-white/50 dark:bg-white/5 p-4 rounded-2xl border border-white/60 dark:border-white/10 font-medium">
              {bmiResult.description}
            </p>

            {/* Ideal Weight Card */}
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                  Healthy Target Weight Range ({effectiveHeightCm} cm)
                </span>
                <div className="text-xl font-black text-slate-950 dark:text-white mt-0.5">
                  {bmiResult.minIdealWeightKg} kg – {bmiResult.maxIdealWeightKg} kg
                </div>
              </div>
              <HeartPulse className="w-7 h-7 text-emerald-600 shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* History of Past BMI Calculations */}
      <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-black text-slate-950 dark:text-white">
              Calculation History & Logs
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
            {bmiHistory.length} saved entries
          </span>
        </div>

        {bmiHistory.length === 0 ? (
          <div className="text-center py-8 bg-white/30 dark:bg-white/5 rounded-2xl border border-dashed border-white/50 text-slate-600 dark:text-slate-400 text-xs font-bold">
            No BMI calculations saved yet. Click "Save Calculation to History" above to start logging.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {bmiHistory.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 shadow-xs flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-slate-950 dark:text-white">{item.bmi}</span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-900 dark:text-emerald-300">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mt-1">
                    {item.weight} kg • {item.height} cm
                  </p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{item.timestamp}</span>
                  </p>
                </div>

                <button
                  onClick={() => onDeleteBmiRecord(item.id)}
                  title="Delete record"
                  className="p-2 rounded-xl bg-white/60 dark:bg-white/10 hover:bg-rose-500/20 text-slate-600 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actionable Health Advice Based on BMI */}
      <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-black text-slate-950 dark:text-white">
            Customized Health & Nutrition Guidance ({bmiResult.category})
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bmiResult.healthAdvice.map((advice, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 flex items-start gap-3 shadow-xs"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {advice}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
