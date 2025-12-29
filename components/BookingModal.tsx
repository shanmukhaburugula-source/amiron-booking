
import React, { useState, useRef, useEffect } from 'react';
import { ICONS, PRICING } from '../constants';
import { Booking, User, AvailabilitySlot } from '../types';
import { getAvailableDates, getShortDayName, formatDate, formatTime, parseTime, getLocalizedSlot } from '../utils/dateHelpers';
import { getAvailabilitySettings, getGlobalBookings, createNewBooking } from '../services/bookingService';

interface BookingModalProps {
  user: User;
  onClose: () => void;
  onConfirm: (booking: Booking) => void;
  userTimezone: string;
}

const SESSION_TYPES = [
  "AI Automation Agents Building",
  "App Development using AI Tools",
  "Custom AI Strategy Consulting",
  "Large Language Model Fine-tuning"
];

const BookingModal: React.FC<BookingModalProps> = ({ user, onClose, onConfirm, userTimezone }) => {
  const [step, setStep] = useState<'date' | 'session' | 'payment' | 'success'>('date');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<any | null>(null);
  const [selectedSessionType, setSelectedSessionType] = useState<string>(SESSION_TYPES[0]);
  const [rules, setRules] = useState<AvailabilitySlot[]>([]);
  const [globalBookings, setGlobalBookings] = useState<Booking[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Show availability 60 days in advance
  const dates = getAvailableDates(60);

  useEffect(() => {
    const fetchInitialData = async () => {
      const [r, g] = await Promise.all([
        getAvailabilitySettings(),
        getGlobalBookings()
      ]);
      setRules(r);
      setGlobalBookings(g);
      setLoadingInitial(false);
    };
    fetchInitialData();
  }, []);

  const getDayAvailability = (date: Date) => {
    const dayOfWeek = date.getDay();
    return rules.filter(s => s.dayOfWeek === dayOfWeek);
  };

  const isTimeOverlappingGlobal = (dateStr: string, startIST: string, duration: number) => {
    const { hours: newStart } = parseTime(startIST);
    const newEnd = newStart + duration;

    return globalBookings.some(b => {
      if (b.date !== dateStr) return false;
      const { hours: bStart } = parseTime(b.startTime);
      const bEnd = bStart + b.duration;
      return (newStart < bEnd && newEnd > bStart);
    });
  };

  const generatePotentialSlots = (date: Date) => {
    const dayRules = getDayAvailability(date);
    const dateStr = formatDate(date);
    const slots: any[] = [];

    dayRules.forEach(rule => {
      const { hours: startH } = parseTime(rule.start);
      const { hours: endH } = parseTime(rule.end);
      
      for (let h = startH; h < endH; h++) {
        const sIST = formatTime(h, 0);
        const localized = getLocalizedSlot(sIST, dateStr, userTimezone);
        
        slots.push({
          startIST: sIST,
          displayTime: localized.time,
          displayDate: localized.dateLabel,
          duration: 1,
          available: !isTimeOverlappingGlobal(dateStr, sIST, 1)
        });
      }
    });

    return slots.sort((a, b) => a.startIST.localeCompare(b.startIST));
  };

  const handleSlotClick = (slot: any) => {
    if (!slot.available) return;
    setSelectedSlot(slot);
    setStep('session');
  };

  const handleConfirmBooking = async () => {
    setLoadingConfirm(true);
    try {
      const bookingData: Partial<Booking> = {
        date: formatDate(selectedDate!),
        startTime: selectedSlot!.startIST,
        endTime: formatTime(parseTime(selectedSlot!.startIST).hours + 1, 0),
        duration: 1,
        price: PRICING.ONE_HOUR,
        timezone: userTimezone,
        sessionType: selectedSessionType,
        userName: user.name
      };
      
      const confirmed = await createNewBooking(user.id, bookingData);
      setStep('success');
      // On success, we don't allow going back anymore
      onConfirm(confirmed);
    } catch (err) {
      console.error("Booking error:", err);
    } finally {
      setLoadingConfirm(false);
    }
  };

  const handleBack = () => {
    if (step === 'date') {
      onClose();
    } else if (step === 'session') {
      setStep('date');
    } else if (step === 'payment') {
      setStep('session');
    }
  };

  if (loadingInitial) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-6 animate-pulse">
          <div className="w-12 h-12 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="text-sm font-black text-zinc-400 uppercase tracking-widest">Scanning Global Slots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-zinc-950 flex flex-col transition-colors duration-300">
      {/* Header with Back and Close */}
      <div className="px-6 md:px-12 py-8 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-6">
          {step !== 'success' && (
            <button 
              onClick={handleBack}
              className="group flex items-center gap-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-black uppercase text-[10px] tracking-widest transition-all"
            >
              <div className="w-10 h-10 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-center group-hover:bg-zinc-50 dark:group-hover:bg-zinc-900 transition-all">
                <ICONS.ChevronLeft className="w-4 h-4" />
              </div>
              Go Back
            </button>
          )}
          <div className="hidden sm:block">
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter">
              {step === 'date' && 'Select a Time'}
              {step === 'session' && 'Choose Focus'}
              {step === 'payment' && 'Confirm Session'}
              {step === 'success' && 'Success'}
            </h2>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:text-red-500 transition-all active:scale-90"
          title="Cancel and Exit"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-12 md:pb-32 max-w-7xl mx-auto w-full">
        {step === 'date' && (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="max-w-xl">
              <span className="text-purple-500 font-black text-[10px] uppercase tracking-[0.2em] mb-3 block">Step 01 / 03</span>
              <h1 className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter leading-tight mb-4">When should we sync?</h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium">Showing 60 days of availability based on your local time: <span className="text-zinc-900 dark:text-zinc-100 font-bold">{userTimezone}</span></p>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar">
                {dates.map((date) => {
                  const isSelected = selectedDate && formatDate(selectedDate) === formatDate(date);
                  const availability = getDayAvailability(date);
                  const isWeekend = date.getDay() === 0;

                  return (
                    <button
                      key={date.toISOString()}
                      disabled={isWeekend || availability.length === 0}
                      onClick={() => setSelectedDate(date)}
                      className={`flex-shrink-0 px-8 py-5 rounded-[1.5rem] flex flex-col items-center justify-center transition-all duration-300 ${
                        isSelected 
                          ? 'bg-zinc-900 dark:bg-purple-600 text-white shadow-2xl scale-105' 
                          : isWeekend || availability.length === 0
                            ? 'bg-zinc-50 dark:bg-zinc-900 text-zinc-300 dark:text-zinc-800 cursor-not-allowed border border-transparent'
                            : 'bg-white dark:bg-zinc-900 text-zinc-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-zinc-100 dark:border-zinc-800'
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">{getShortDayName(date)}</span>
                      <span className="text-xl font-black">{date.getDate()}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
                {selectedDate ? (
                  generatePotentialSlots(selectedDate).map((slot, idx) => (
                    <div
                      key={`${slot.startIST}-${idx}`}
                      className="group bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 border border-zinc-100 dark:border-zinc-800 shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex flex-col transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] hover:border-purple-200 dark:hover:border-purple-800"
                    >
                      <div className="flex justify-between items-start mb-8">
                         <span className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">{slot.displayTime}</span>
                         <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                           slot.available 
                             ? 'bg-green-50 dark:bg-green-900/20 text-green-500 dark:text-green-400 border-green-100 dark:border-green-900/50' 
                             : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-300 dark:text-zinc-700 border-zinc-100 dark:border-zinc-800'
                         }`}>
                           {slot.available ? 'Available' : 'Booked'}
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-2.5 text-zinc-400 font-bold text-[11px] uppercase tracking-[0.2em] mb-12">
                         <ICONS.Clock className="w-4 h-4 opacity-40" />
                         60 MINUTE SESSION
                      </div>

                      <button
                        disabled={!slot.available}
                        onClick={() => handleSlotClick(slot)}
                        className={`w-full py-5 rounded-2xl text-sm font-black transition-all duration-300 ${
                          slot.available 
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100 dark:shadow-none' 
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-300 dark:text-zinc-600 cursor-not-allowed'
                        }`}
                      >
                        {slot.available ? 'Select Slot' : 'Slot Unavailable'}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-24 flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/20 rounded-[3rem] border-2 border-dashed border-zinc-100 dark:border-zinc-800">
                    <div className="w-20 h-20 bg-white dark:bg-zinc-900 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm">
                      <ICONS.Calendar className="w-10 h-10 text-zinc-200 dark:text-zinc-800" />
                    </div>
                    <p className="font-black uppercase tracking-widest text-sm text-zinc-400">Please select a date from the slider above</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 'session' && (
          <div className="max-w-3xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="text-center">
              <span className="text-purple-500 font-black text-[10px] uppercase tracking-[0.2em] mb-3 block">Step 02 / 03</span>
              <h2 className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter mb-4">Choose your Focus</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium">Select the session archetype that matches your goals.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {SESSION_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => { setSelectedSessionType(type); setStep('payment'); }}
                  className={`w-full text-left p-10 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] hover:border-indigo-600 dark:hover:border-indigo-500 hover:bg-indigo-50/10 dark:hover:bg-indigo-900/10 transition-all group flex items-center justify-between ${selectedSessionType === type ? 'ring-4 ring-indigo-500/10 border-indigo-500' : ''}`}
                >
                  <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800 rounded-[1.25rem] flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <ICONS.Check className={`w-6 h-6 ${selectedSessionType === type ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-200'}`} />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-zinc-900 dark:text-white mb-1">{type}</h4>
                      <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Advanced AI Implementation Workflow</p>
                    </div>
                  </div>
                  <ICONS.ChevronRight className="w-6 h-6 text-zinc-200 group-hover:text-indigo-600 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'payment' && (
          <div className="max-w-2xl mx-auto space-y-12 animate-in slide-in-from-right-8 duration-500">
            <div className="text-center">
              <span className="text-purple-500 font-black text-[10px] uppercase tracking-[0.2em] mb-3 block">Step 03 / 03</span>
              <h2 className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter mb-4">Confirm & Pay</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium">Review your high-precision session details.</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-12 border border-zinc-100 dark:border-zinc-800 shadow-2xl shadow-zinc-100 dark:shadow-none">
              <div className="flex items-center gap-8 mb-12">
                <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-[1.75rem] flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <ICONS.Clock className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter mb-1">Investment Summary</h3>
                  <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest">{selectedSessionType}</p>
                </div>
              </div>

              <div className="space-y-8">
                {[
                  { label: "Client Name", value: user.name },
                  { label: "Session Domain", value: selectedSessionType },
                  { label: "Global Schedule", value: `${selectedSlot?.displayDate} at ${selectedSlot?.displayTime}` },
                  { label: "Timeframe", value: "1 Hour Professional Session" },
                  { label: "Local Timezone", value: userTimezone }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-5 border-b border-zinc-50 dark:border-zinc-800 last:border-0">
                    <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.2em]">{item.label}</span>
                    <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">{item.value}</span>
                  </div>
                ))}

                <div className="pt-8 flex justify-between items-center">
                  <span className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Total Investment</span>
                  <span className="text-5xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">${PRICING.ONE_HOUR}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <button
                onClick={handleConfirmBooking}
                disabled={loadingConfirm}
                className="w-full py-7 bg-zinc-900 dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-700 text-white text-2xl font-black rounded-[2rem] shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4"
              >
                {loadingConfirm ? (
                  <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Confirm & Pay via Stripe'
                )}
              </button>
              <p className="text-center text-zinc-400 font-bold text-[10px] uppercase tracking-widest">Secure 256-bit Encrypted Transaction</p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="max-w-2xl mx-auto py-20 text-center animate-in zoom-in-95 duration-500">
            <div className="w-40 h-40 bg-green-50 dark:bg-green-900/20 text-green-500 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-12 border-8 border-white dark:border-zinc-900 shadow-2xl">
              <ICONS.Check className="w-20 h-20" />
            </div>
            <h4 className="text-6xl font-black text-zinc-900 dark:text-white tracking-tighter mb-6">Confirmed</h4>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mb-16 text-xl font-medium leading-relaxed">
              Success! Your <span className="text-zinc-900 dark:text-zinc-100 font-black">{selectedSessionType}</span> slot is secured. You can now access session materials in your dashboard.
            </p>
            <button
              onClick={onClose}
              className="bg-zinc-900 dark:bg-purple-600 hover:bg-black dark:hover:bg-purple-700 text-white px-20 py-6 rounded-[2rem] font-black text-xl transition-all active:scale-95 shadow-2xl shadow-zinc-200 dark:shadow-none"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
