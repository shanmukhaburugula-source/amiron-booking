
import React from 'react';
import { ICONS } from '../constants';
import { Booking } from '../types';

interface HistoryProps {
  bookings: Booking[];
  onBack: () => void;
}

const History: React.FC<HistoryProps> = ({ bookings, onBack }) => {
  const pastBookings = bookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-7xl mx-auto w-full p-6 md:p-12 lg:p-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-3">
          <button 
            onClick={onBack}
            className="text-purple-600 font-bold flex items-center gap-2 hover:translate-x-[-4px] transition-transform mb-4 text-sm"
          >
            <ICONS.ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">Session Archive</h2>
          <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 font-medium">History of your past consultations.</p>
        </div>
      </div>

      {pastBookings.length === 0 ? (
        <div className="bg-zinc-50/40 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-12 md:p-24 text-center">
          <div className="w-20 h-20 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-zinc-50 dark:border-zinc-800 shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10 text-zinc-200 dark:text-zinc-700"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-3">No History Yet</h3>
          <p className="text-zinc-500 mb-10 max-w-sm mx-auto text-base font-medium">
            Completed sessions will automatically appear here for your records.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pastBookings.map((booking) => (
            <div 
              key={booking.id}
              className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between opacity-80"
            >
              <div className="flex items-center gap-6 md:gap-10">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-500 dark:text-zinc-400 font-black shrink-0">
                  <span className="text-[10px] uppercase tracking-widest mb-0.5">{new Date(booking.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                  <span className="text-2xl md:text-3xl leading-none tracking-tighter">{new Date(booking.date).getDate()}</span>
                </div>
                <div>
                  <h4 className="font-black text-zinc-700 dark:text-zinc-300 text-xl md:text-2xl mb-1">{booking.sessionType}</h4>
                  <div className="flex items-center gap-4 text-zinc-400 dark:text-zinc-500 text-xs font-bold">
                    <span className="flex items-center gap-2">
                      <ICONS.Clock className="w-4 h-4 opacity-60" />
                      {booking.startTime} - {booking.endTime}
                    </span>
                    <span className="w-1 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full"></span>
                    <span className="uppercase tracking-widest text-[10px]">{booking.duration} Hour</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 md:mt-0">
                <span className="px-4 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-500 text-[10px] font-black rounded-lg uppercase tracking-widest border border-zinc-200 dark:border-zinc-700">
                  Completed
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
