import React, { useState } from 'react';
import { MOTIVATIONAL_QUOTES } from '../data/initialData';
import { Quote, RefreshCw, Sparkles, Check, Copy } from 'lucide-react';

export const MotivationalQuoteCard: React.FC = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex % MOTIVATIONAL_QUOTES.length];

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`"${currentQuote.quote}" — ${currentQuote.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-5 sm:p-6 shadow-xl border border-white/60 dark:border-white/10 relative overflow-hidden">
      {/* Decorative accent background */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-md shrink-0 mt-0.5">
            <Quote className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Daily Wellness Inspiration
              </span>
            </div>
            <p className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 italic leading-snug">
              "{currentQuote.quote}"
            </p>
            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400 mt-1">
              — {currentQuote.author}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button
            onClick={handleCopy}
            title="Copy quote to clipboard"
            className="p-2.5 rounded-xl bg-white/60 dark:bg-white/10 hover:bg-white/80 text-slate-800 dark:text-slate-200 border border-white/60 dark:border-white/15 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs backdrop-blur-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
          </button>
          <button
            onClick={handleNextQuote}
            title="Show another wellness quote"
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-700/20"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Quote</span>
          </button>
        </div>
      </div>
    </div>
  );
};
