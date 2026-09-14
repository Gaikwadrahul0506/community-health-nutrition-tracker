import React from 'react';
import { DayRecord, WaterLogEntry } from '../types';
import {
  Droplet,
  Plus,
  Minus,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Clock,
  Waves,
  HeartPulse,
  Brain,
  Smile,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WaterTrackerViewProps {
  currentDayRecord: DayRecord;
  waterGoalGlasses: number;
  onAddWater: (amountMl: number) => void;
  onRemoveWater: (amountMl: number) => void;
  onResetWater: () => void;
}

export const WaterTrackerView: React.FC<WaterTrackerViewProps> = ({
  currentDayRecord,
  waterGoalGlasses,
  onAddWater,
  onRemoveWater,
  onResetWater
}) => {
  const currentTotalMl = currentDayRecord?.waterTotalMl || 0;
  const currentGlasses = Math.round(currentTotalMl / 250);
  const targetTotalMl = (waterGoalGlasses || 8) * 250;
  const percentage = Math.min(100, Math.round((currentTotalMl / targetTotalMl) * 100));
  const isGoalReached = currentGlasses >= (waterGoalGlasses || 8);
  const safeWaterLogs = currentDayRecord?.waterLogs || [];

  const handleAddGlass = (amount: number = 250) => {
    onAddWater(amount);
    if (currentGlasses + 1 === waterGoalGlasses) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const hydrationBenefits = [
    { icon: Brain, title: 'Sharp Cognitive Focus', text: 'Prevents midday mental fog, headaches, and keeps memory sharp.' },
    { icon: Zap, title: 'Physical Energy & Stamina', text: 'Hydrates working muscles and prevents early workout fatigue.' },
    { icon: HeartPulse, title: 'Kidney & Heart Support', text: 'Helps flush toxins, prevents kidney stones, and normalizes blood pressure.' },
    { icon: Smile, title: 'Youthful Skin & Digestion', text: 'Supports regular nutrient absorption, gut motility, and radiant skin.' }
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner in Frosted Glass */}
      <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 dark:bg-blue-950/80 text-blue-900 dark:text-blue-300 text-xs font-black border border-white/60 dark:border-blue-700/50 mb-2 shadow-xs backdrop-blur-md">
              <Droplet className="w-3.5 h-3.5 text-blue-600" />
              <span>Daily Hydration Goal: {waterGoalGlasses} Glasses ({(targetTotalMl / 1000).toFixed(1)} L)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
              Water Intake Tracker
            </h1>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">
              Drink water regularly throughout the day to nourish your cells and stay energized.
            </p>
          </div>

          {isGoalReached && (
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-700/20 animate-bounce">
              <Sparkles className="w-4 h-4" />
              <span>Goal Achieved! Outstanding Hydration!</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Hydration Visualizer & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Visual Water Tank / Glass Level (5 cols) in Frosted Glass */}
        <div className="lg:col-span-5 bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl flex flex-col items-center justify-between relative overflow-hidden">
          <div className="w-full flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-4">
            <span className="flex items-center gap-1 text-blue-900 dark:text-blue-400 font-black">
              <Waves className="w-4 h-4 text-blue-600" /> Bottle Capacity
            </span>
            <span className="font-black text-blue-900 dark:text-blue-300">{percentage}% Completed</span>
          </div>

          {/* Graphical Water Cylinder */}
          <div className="relative w-44 h-72 rounded-3xl border-4 border-blue-400/80 dark:border-blue-500/80 bg-white/40 dark:bg-slate-800/80 backdrop-blur-md p-1.5 shadow-2xl flex flex-col justify-end overflow-hidden my-4">
            {/* Water Wave Fill */}
            <div
              style={{ height: `${percentage}%` }}
              className="w-full bg-gradient-to-t from-blue-600 via-cyan-500 to-sky-400 rounded-b-2xl transition-all duration-700 relative flex items-center justify-center shadow-lg"
            >
              {/* Ripple animation bar on top edge */}
              <div className="absolute top-0 left-0 right-0 h-2.5 bg-white/50 animate-pulse rounded-t-full" />

              {/* Inside stats */}
              {percentage > 15 && (
                <div className="text-center text-white drop-shadow-md select-none">
                  <div className="text-2xl font-black">{currentTotalMl} ml</div>
                  <div className="text-[11px] font-bold opacity-90">{currentGlasses} / {waterGoalGlasses} glasses</div>
                </div>
              )}
            </div>

            {/* If level is low, display text on top */}
            {percentage <= 15 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-800 dark:text-slate-200 pointer-events-none">
                <div className="text-2xl font-black">{currentTotalMl} ml</div>
                <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{currentGlasses} glasses</div>
              </div>
            )}
          </div>

          <div className="text-center">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Target: <strong className="text-slate-900 dark:text-white">{targetTotalMl} ml</strong> ({waterGoalGlasses} standard 250ml glasses)
            </div>
          </div>
        </div>

        {/* Interactive Glass Grid & Quick Drink Buttons (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 8-Glass Visual Interactive Grid */}
          <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-white/60 dark:border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-950 dark:text-white">
                Interactive Daily Glass Tracker
              </h3>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Tap any glass to fill or unfill
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
              {Array.from({ length: Math.max(8, waterGoalGlasses) }).map((_, index) => {
                const isFilled = index < currentGlasses;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (isFilled) {
                        onRemoveWater(250);
                      } else {
                        handleAddGlass(250);
                      }
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                      isFilled
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md scale-105'
                        : 'bg-white/40 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-white/60 dark:border-white/10 hover:border-blue-400 shadow-xs backdrop-blur-xs'
                    }`}
                  >
                    <Droplet className={`w-6 h-6 ${isFilled ? 'fill-current text-white' : 'text-blue-500/60 dark:text-slate-400'}`} />
                    <span className="text-[10px] font-black mt-1">Glass {index + 1}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Increment Controls */}
          <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-white/60 dark:border-white/10 shadow-xl space-y-4">
            <h3 className="text-base font-black text-slate-950 dark:text-white">
              Quick Log Actions
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => handleAddGlass(250)}
                className="py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-700/20 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ 1 Glass (250ml)</span>
              </button>

              <button
                onClick={() => handleAddGlass(500)}
                className="py-3 px-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-700/20 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ 1 Bottle (500ml)</span>
              </button>

              <button
                onClick={() => onRemoveWater(250)}
                disabled={currentTotalMl <= 0}
                className="py-3 px-4 rounded-2xl bg-white/60 dark:bg-white/10 hover:bg-white/80 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all flex flex-col items-center justify-center gap-1 disabled:opacity-40 cursor-pointer border border-white/50 dark:border-white/10 shadow-xs backdrop-blur-sm"
              >
                <Minus className="w-4 h-4" />
                <span>- 1 Glass (250ml)</span>
              </button>

              <button
                onClick={onResetWater}
                className="py-3 px-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-800 dark:text-rose-300 font-bold text-xs transition-all flex flex-col items-center justify-center gap-1 cursor-pointer border border-rose-400/30 shadow-xs backdrop-blur-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Water</span>
              </button>
            </div>
          </div>

          {/* Today's Hydration Log Timestamps */}
          <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-white/60 dark:border-white/10 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-black text-slate-950 dark:text-white">
                  Today's Intake Log
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                {safeWaterLogs.length} entries
              </span>
            </div>

            {safeWaterLogs.length === 0 ? (
              <div className="py-4 text-center text-xs font-medium text-slate-600 dark:text-slate-400 bg-white/30 dark:bg-white/5 rounded-2xl border border-dashed border-white/50 dark:border-white/10">
                No water entries logged yet today. Tap above to drink your first glass!
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
                {safeWaterLogs.map((log) => (
                  <div
                    key={log.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 dark:bg-blue-950/50 border border-white/60 dark:border-blue-900 text-xs font-bold text-blue-900 dark:text-blue-300 shadow-xs backdrop-blur-sm"
                  >
                    <Droplet className="w-3 h-3 text-blue-600" />
                    <span>+{log.amountMl}ml at {log.timestamp}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Benefits of Hydration Grid */}
      <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl space-y-4">
        <h3 className="text-lg font-black text-slate-950 dark:text-white">
          Why Community Hydration is Vital
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {hydrationBenefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/50 dark:border-white/10 space-y-1.5 shadow-xs"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-2 shadow-xs">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="font-black text-sm text-slate-950 dark:text-white">
                  {b.title}
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {b.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
