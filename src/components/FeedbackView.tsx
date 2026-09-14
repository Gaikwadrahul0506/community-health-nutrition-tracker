import React, { useState } from 'react';
import { FeedbackSubmission, UserAccount } from '../types';
import {
  MessageSquareHeart,
  Star,
  Send,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  FileText,
  Clock,
  Sparkles,
  ShieldCheck,
  Tag,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FeedbackViewProps {
  feedbacks: FeedbackSubmission[];
  onSubmitFeedback: (feedback: Omit<FeedbackSubmission, 'id' | 'timestamp' | 'userId'>) => void;
  onOpenReportModal: () => void;
  currentUser?: UserAccount;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({
  feedbacks = [],
  onSubmitFeedback,
  onOpenReportModal,
  currentUser
}) => {
  const safeFeedbacks = feedbacks || [];
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<FeedbackSubmission['category']>('general');
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // FAQ open states
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is the goal of this Community Engagement Project (CEP)?',
      a: 'The objective of this CEP initiative is to democratize preventive health literacy. We provide urban and campus communities with easy-to-use digital tools for monitoring calorie intake, 8-glass hydration adherence, BMI classification, and physical movement.'
    },
    {
      q: 'How does the BMI Calculator evaluate health status?',
      a: 'Our calculator implements standard World Health Organization (WHO) BMI formulas, categorizing scores into Underweight (<18.5), Normal (18.5 - 24.9), Overweight (25 - 29.9), and Obese (>=30), accompanied by ideal weight range targets for your height.'
    },
    {
      q: 'Is my personal dietary data secure and private?',
      a: 'Yes! All meal records, daily water logs, and biometric profiles remain strictly on your local browser device via HTML5 LocalStorage. No third-party tracking or data sales occur.'
    },
    {
      q: 'Can our community center or school use this website for health drives?',
      a: 'Absolutely. You can conduct group surveys with our Community Survey tab, book consultation slots in the Health Camps, and print out collective health reports.'
    }
  ];

  const ratingDescriptions: Record<number, string> = {
    1: '1 Star - Needs Major Improvement',
    2: '2 Stars - Fair / Some Issues',
    3: '3 Stars - Good / Average',
    4: '4 Stars - Very Good / Helpful',
    5: '5 Stars - Excellent / Outstanding'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!comments.trim()) {
      setFormError('Please write your feedback message or suggestions.');
      return;
    }

    const trimmedSubject = subject.trim() || `${category.replace('_', ' ').toUpperCase()} Feedback`;
    const trimmedName = name.trim() || currentUser?.name || 'Community Member';
    const trimmedEmail = email.trim() || currentUser?.email || 'community@nutritrack.org';

    onSubmitFeedback({
      name: trimmedName,
      email: trimmedEmail,
      subject: trimmedSubject,
      rating,
      category,
      comments: comments.trim(),
      status: 'pending'
    });

    setSubmitted(true);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });

    setTimeout(() => {
      setSubmitted(false);
      setComments('');
      setSubject('');
    }, 4000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-950 dark:text-emerald-300 text-xs font-black border border-emerald-500/30 mb-2 shadow-xs">
              <MessageSquareHeart className="w-3.5 h-3.5 text-emerald-600" />
              <span>Community Feedback & Support Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
              Community Feedback & Inquiries
            </h1>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">
              Help us enhance NutriTrack. Submit ratings, share meal suggestions, report issues, or generate your CEP health report.
            </p>
          </div>

          <button
            onClick={onOpenReportModal}
            className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-700/20 transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Generate CEP Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Feedback Submission Form (7 cols) */}
        <div className="lg:col-span-7 bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
              <MessageSquareHeart className="w-5 h-5 text-emerald-600" />
              <span>Send Your Feedback & Suggestions</span>
            </h3>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              Direct to Coordinators
            </span>
          </div>

          {submitted ? (
            <div className="py-12 text-center space-y-3 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-xl font-black text-slate-950 dark:text-white">
                Feedback Submitted Successfully!
              </h4>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-sm mx-auto">
                Thank you for your valuable response! Your feedback has been recorded and submitted to the Admin Panel for review.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
              {formError && (
                <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-900 dark:text-rose-200 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Star Rating Section */}
              <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-white/60 dark:border-white/10 space-y-2">
                <label className="block font-black text-slate-800 dark:text-slate-200">
                  Rate Your Experience with NutriTrack <span className="text-rose-500">*</span>
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="p-1 text-slate-300 hover:scale-115 transition-transform cursor-pointer focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            (hoverRating || rating) >= star
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-black text-emerald-800 dark:text-emerald-300 bg-emerald-500/15 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                    {ratingDescriptions[hoverRating || rating]}
                  </span>
                </div>
              </div>

              {/* Category & Topic */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-black text-slate-800 dark:text-slate-200 mb-1.5">
                    Feedback Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white/70 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-semibold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="general">General Experience & App UI</option>
                    <option value="nutrition">Nutrition Tracker & Indian Foods</option>
                    <option value="community">Health Camps & Consultation Slots</option>
                    <option value="suggestion">Feature Request / Suggestion</option>
                    <option value="cep_inquiry">CEP Academic Inquiry / Research</option>
                  </select>
                </div>

                <div>
                  <label className="block font-black text-slate-800 dark:text-slate-200 mb-1.5">
                    Subject / Headline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Great daily water reminders"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white/70 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-semibold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-black text-slate-800 dark:text-slate-200 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Gaikwad"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white/70 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-semibold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-800 dark:text-slate-200 mb-1.5">
                    Email or Phone
                  </label>
                  <input
                    type="text"
                    placeholder="name@example.com / +91..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white/70 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-semibold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Comments / Message */}
              <div>
                <label className="block font-black text-slate-800 dark:text-slate-200 mb-1.5">
                  Your Feedback / Suggestions <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share your thoughts, report any issue, or suggest features for upcoming community health drives..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white/70 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-normal text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Feedback to Admin Panel</span>
              </button>
            </form>
          )}
        </div>

        {/* FAQs & Contact Coordinators (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Coordinators Contact Card */}
          <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-white/60 dark:border-white/10 shadow-xl space-y-4">
            <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>CEP Project Coordinators</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="p-3 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-950 dark:text-white font-black">Rahul Gaikwad</strong>
                  <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-bold uppercase">Lead Coordinator</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate font-mono text-[11px]">gaikwadrahul0506@gmail.com</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>+91 9833618673</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-950 dark:text-white font-black">Rohini Sharma</strong>
                  <span className="text-[10px] text-teal-800 dark:text-teal-400 font-bold uppercase">Nutrition Research</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="truncate font-mono text-[11px]">rohin9324@gmail.com</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>+91 9324408918</span>
                </div>
              </div>
            </div>
          </div>

          {/* FAQs Accordion */}
          <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-white/60 dark:border-white/10 shadow-xl space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <h3 className="text-base font-black text-slate-950 dark:text-white">
                Frequently Asked Questions
              </h3>
            </div>

            <div className="space-y-2">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-white/60 dark:border-white/10 rounded-2xl overflow-hidden bg-white/40 dark:bg-white/5"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-3.5 text-left text-xs font-black text-slate-900 dark:text-white flex items-center justify-between hover:bg-white/60 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <span className="pr-2">{faq.q}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="p-3.5 pt-0 text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed border-t border-white/40 dark:border-white/10">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Community Feedback Feed */}
      <div className="bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-black text-slate-950 dark:text-white">
              Recent Community Reviews ({safeFeedbacks.length})
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
            Average Rating: {(safeFeedbacks.reduce((acc, f) => acc + (f.rating || 0), 0) / Math.max(1, safeFeedbacks.length)).toFixed(1)} ★
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {safeFeedbacks.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 shadow-xs space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-950 dark:text-white">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                </div>

                {item.subject && (
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {item.subject}
                  </p>
                )}

                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  "{item.comments}"
                </p>

                {item.adminNote && (
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-900 dark:text-emerald-300 font-semibold">
                    <strong className="text-emerald-800 dark:text-emerald-200">Admin Response:</strong> {item.adminNote}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-white/40 dark:border-white/10 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                <span className="uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-900 dark:text-emerald-300">
                  {item.category.replace('_', ' ')}
                </span>
                <span className={`px-1.5 py-0.5 rounded-md font-bold uppercase ${
                  item.status === 'resolved'
                    ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                    : item.status === 'reviewed'
                    ? 'bg-sky-500/20 text-sky-800 dark:text-sky-300'
                    : 'bg-amber-500/20 text-amber-800 dark:text-amber-300'
                }`}>
                  {item.status || 'pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
