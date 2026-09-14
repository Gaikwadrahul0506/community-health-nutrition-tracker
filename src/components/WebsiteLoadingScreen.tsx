import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HeartPulse,
  Sparkles,
  Activity,
  Droplet,
  UtensilsCrossed,
  ShieldCheck,
  Scale,
  ArrowRight,
  Zap
} from 'lucide-react';

interface WebsiteLoadingScreenProps {
  onComplete: () => void;
  brandTitle?: string;
  subtitle?: string;
}

export const WebsiteLoadingScreen: React.FC<WebsiteLoadingScreenProps> = ({
  onComplete,
  brandTitle = 'NutriTrack',
  subtitle = 'Community Nutrition & Health Engagement Initiative'
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const loadingSteps = [
    { label: 'Initializing nutrition & foods directory...', icon: UtensilsCrossed, color: 'text-emerald-500' },
    { label: 'Calibrating hydration & BMI health engines...', icon: Droplet, color: 'text-sky-500' },
    { label: 'Loading exercise catalog & video tutorials...', icon: Activity, color: 'text-orange-500' },
    { label: 'Configuring Gemini AI Health Assistant...', icon: Sparkles, color: 'text-purple-500' },
    { label: 'Preparing secure member authentication...', icon: ShieldCheck, color: 'text-teal-500' },
    { label: 'Opening Login Portal...', icon: HeartPulse, color: 'text-rose-500' }
  ];

  useEffect(() => {
    const totalDuration = 2200; // 2.2 seconds total animation
    const intervalTime = 30;
    const stepIncrement = 100 / (totalDuration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + stepIncrement;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 350);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Update step index based on progress
  useEffect(() => {
    const step = Math.min(
      loadingSteps.length - 1,
      Math.floor((progress / 100) * loadingSteps.length)
    );
    setCurrentStepIndex(step);
  }, [progress, loadingSteps.length]);

  const CurrentStepIcon = loadingSteps[currentStepIndex].icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-emerald-950 via-slate-950 to-teal-950 text-white overflow-hidden p-6 select-none"
    >
      {/* Background Animated Glowing Ambient Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.25, 0.45, 0.25],
          x: [0, 20, 0],
          y: [0, -20, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -25, 0],
          y: [0, 25, 0]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.3, 0.15]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-1/3 right-1/4 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl pointer-events-none"
      />

      {/* Main Glass Card Loader Container */}
      <motion.div
        initial={{ scale: 0.92, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md bg-white/10 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-emerald-950/60 flex flex-col items-center text-center"
      >
        {/* Animated Heartbeat & Health Pulse Logo */}
        <div className="relative mb-6">
          {/* Outer Pulsing Glow Rings */}
          <motion.div
            animate={{
              scale: [1, 1.45, 1.8],
              opacity: [0.8, 0.3, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut'
            }}
            className="absolute inset-0 rounded-3xl bg-emerald-500/30 blur-sm pointer-events-none"
          />
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.5, 0.9, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 opacity-60 blur-md pointer-events-none"
          />

          {/* Central Logo Container */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 p-0.5 shadow-xl flex items-center justify-center">
            <div className="w-full h-full rounded-[22px] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.15, 1, 1.18, 1],
                  rotate: [0, -3, 3, 0]
                }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <HeartPulse className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
              </motion.div>
            </div>
          </div>

          {/* Floating Orbiting Sparkle Badge */}
          <motion.div
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
          </motion.div>
        </div>

        {/* Brand Name & Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="space-y-1.5 mb-8"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-black uppercase tracking-wider mb-1">
            <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
            <span>Smart Health & Nutrition Engine</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>{brandTitle}</span>
            <span className="text-emerald-400 text-xs px-2 py-0.5 rounded-lg bg-emerald-500/20 font-bold border border-emerald-400/30">
              v2.0
            </span>
          </h1>
          <p className="text-xs font-medium text-slate-300 max-w-xs mx-auto leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        {/* Progress Bar & Percentage */}
        <div className="w-full space-y-3 mb-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-1">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>Loading Health Modules</span>
            </span>
            <span className="font-mono text-emerald-300 text-sm font-black">
              {Math.round(progress)}%
            </span>
          </div>

          {/* High-Tech Progress Track */}
          <div className="relative w-full h-3 bg-slate-900/80 rounded-full overflow-hidden border border-white/10 p-0.5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400 shadow-[0_0_15px_rgba(52,211,153,0.7)]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>
        </div>

        {/* Current Initializing Step Indicator */}
        <div className="h-10 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2 text-xs font-medium text-slate-200"
            >
              <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-xs">
                <CurrentStepIcon className={`w-4 h-4 ${loadingSteps[currentStepIndex].color}`} />
              </div>
              <span className="truncate max-w-[280px]">
                {loadingSteps[currentStepIndex].label}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Direct Skip / Fast Entry Action */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={onComplete}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-bold transition-all border border-white/10 hover:border-emerald-400/40 cursor-pointer group"
        >
          <span>Skip to Login</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </motion.button>
      </motion.div>

      {/* Community Engagement Footer note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.4 }}
        className="relative z-10 mt-8 text-[11px] font-medium text-emerald-300/80 text-center"
      >
        <span>CEP Health & Community Wellness Initiative • Rahul Gaikwad & Rohini Sharma</span>
      </motion.div>
    </motion.div>
  );
};
