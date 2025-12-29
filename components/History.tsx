
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
    <div className="max-w-7xl mx-auto w-full p-6 md:p-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-4">
          <button 
            onClick={onBack}
            className="text-purple-500 font-bold flex items-center gap-2 hover:translate-x-[-4px] transition-transform mb-4"
          >
            <ICONS.ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h2 className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">Session Archive</h2>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 font-medium">History of your past consultations.</p>
        </div>
      </div>

      {pastBookings.length === 0 ? (
        <div className="bg-zinc-50/40 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800 rounded-[3.5rem] p-16 md:p-32 text-center">
          <div className="w-24 h-24 bg-white dark:bg-zinc-900 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-zinc-50 dark:border-zinc-800 shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12 text-zinc-200 dark:text-zinc-700"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <h3 className="text-3xl font-black text-zinc-900 dark:text-white mb-4">No History Yet</h3>
          <p className="text-zinc-400 mb-12 max-w-sm mx-auto text-lg font-medium">
            Completed sessions will automatically appear here for your records.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {pastBookings.map((booking) => (
            <div 
              key={booking.id}
              className="bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-10 flex flex-col md:flex-row md:items-center justify-between opacity-80"
            >
              <div className="flex items-center gap-10">
                <div className="w-20 h-20 bg-zinc-200 dark:bg-zinc-800 rounded-[1.75rem] flex flex-col items-center justify-center text-zinc-500 dark:text-zinc-400 font-black">
                  <span className="text-[11px] uppercase tracking-widest mb-1">{new Date(booking.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                  <span className="text-3xl leading-none tracking-tighter">{new Date(booking.date).getDate()}</span>
                </div>
                <div>
                  <h4 className="font-black text-zinc-700 dark:text-zinc-300 text-2xl mb-2">{booking.sessionType}</h4>
                  <div className="flex items-center gap-6 text-zinc-400 dark:text-zinc-500 text-sm font-bold">
                    <span className="flex items-center gap-2.5">
                      <ICONS.Clock className="w-5 h-5 opacity-60" />
                      {booking.startTime} - {booking.endTime}
                    </span>
                    <span className="w-1.5 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full"></span>
                    <span className="uppercase tracking-widest text-[10px]">{booking.duration} Hour</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 md:mt-0">
                <span className="px-5 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-500 text-[10px] font-black rounded-xl uppercase tracking-widest">
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
