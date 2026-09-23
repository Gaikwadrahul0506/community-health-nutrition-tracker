import React, { useState } from 'react';
import { HealthSlot, UserAccount, SlotBooking } from '../types';
import {
  CalendarCheck2,
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  CheckCircle2,
  X,
  AlertCircle,
  Sparkles,
  Phone,
  Mail,
  User
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SlotBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  slots: HealthSlot[];
  currentUser?: UserAccount | null;
  onBookSlot: (slotId: string, notes?: string) => void;
  onCancelBooking: (slotId: string) => void;
}

export const SlotBookingModal: React.FC<SlotBookingModalProps> = ({
  isOpen,
  onClose,
  slots,
  currentUser,
  onBookSlot,
  onCancelBooking
}) => {
  const [selectedSlot, setSelectedSlot] = useState<HealthSlot | null>(null);
  const [notes, setNotes] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'in_person' | 'online_consultation'>('all');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredSlots = slots.filter((s) => {
    if (filterMode === 'all') return true;
    return s.venueType === filterMode;
  });

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !currentUser) return;

    onBookSlot(selectedSlot.id, notes);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });
    setSuccessMsg(`Successfully booked your slot for "${selectedSlot.title}"!`);
    setSelectedSlot(null);
    setNotes('');

    setTimeout(() => {
      setSuccessMsg(null);
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/80 dark:border-white/10 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
              <CalendarCheck2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-950 dark:text-white">
                Book Consultation & Health Camp Slots
              </h2>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Reserve 1-on-1 time with Health Coordinators (Rahul Gaikwad & Rohini Sharma).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-950 dark:text-emerald-200 text-xs font-bold flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterMode === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            All Slots ({slots.length})
          </button>
          <button
            onClick={() => setFilterMode('in_person')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              filterMode === 'in_person'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>In-Person Camps</span>
          </button>
          <button
            onClick={() => setFilterMode('online_consultation')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              filterMode === 'online_consultation'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Virtual Consultations</span>
          </button>
        </div>

        {/* Booking Confirmation Dialog */}
        {selectedSlot && (
          <form onSubmit={handleConfirmBooking} className="p-5 rounded-2xl bg-emerald-50 dark:bg-slate-800/80 border border-emerald-500/30 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Confirm Slot Reservation: {selectedSlot.title}</span>
              </h4>
              <button
                type="button"
                onClick={() => setSelectedSlot(null)}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-700 space-y-1">
                <div className="text-slate-500">Attendee Name:</div>
                <div className="font-bold text-slate-900 dark:text-white">{currentUser?.name || 'Guest'}</div>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-700 space-y-1">
                <div className="text-slate-500">Contact Email & Phone:</div>
                <div className="font-bold text-slate-900 dark:text-white">{currentUser?.email || 'N/A'} • {currentUser?.phone || 'N/A'}</div>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-700 space-y-1">
                <div className="text-slate-500">Date & Time:</div>
                <div className="font-bold text-slate-900 dark:text-white">{selectedSlot.date} ({selectedSlot.timeRange})</div>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-700 space-y-1">
                <div className="text-slate-500">Lead Coordinator:</div>
                <div className="font-bold text-emerald-700 dark:text-emerald-300">{selectedSlot.doctorOrCoordinator}</div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                Health Notes / Specific Questions for Coordinator (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. I would like a personalized diet plan for diabetes management..."
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedSlot(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold cursor-pointer"
              >
                Go Back
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Reserve My Slot</span>
              </button>
            </div>
          </form>
        )}

        {/* Available Slots Grid */}
        <div className="space-y-4">
          {filteredSlots.map((slot) => {
            const booked = slot.bookedCount || (slot.bookings ? slot.bookings.length : 0);
            const remaining = Math.max(0, slot.capacity - booked);
            const isUserBooked = !!currentUser && slot.bookings?.some((b) => b.userId === currentUser.id);

            return (
              <div
                key={slot.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 hover:border-emerald-500/40 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase">
                        {slot.type.replace(/_/g, ' ')}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        {slot.venueType === 'online_consultation' ? <Video className="w-3 h-3 text-sky-500" /> : <MapPin className="w-3 h-3 text-emerald-600" />}
                        <span>{slot.location}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {slot.title}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      Coordinator: {slot.doctorOrCoordinator}
                    </p>
                  </div>

                  {/* Booking Action Button */}
                  <div className="self-start sm:self-auto shrink-0">
                    {isUserBooked ? (
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-black flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>You're Booked</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => onCancelBooking(slot.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-700 dark:text-rose-300 text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : remaining > 0 ? (
                      <button
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md shadow-emerald-700/20 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <CalendarCheck2 className="w-4 h-4" />
                        <span>Book Slot ({remaining} left)</span>
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-500 text-xs font-bold">
                        Slot Full
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  {slot.description}
                </p>

                <div className="flex flex-wrap items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700/50">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{slot.date}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      <span>{slot.timeRange}</span>
                    </span>
                  </div>

                  <span>
                    Capacity: <strong className="text-slate-800 dark:text-slate-200">{booked}/{slot.capacity} slots</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
