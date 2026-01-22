
import React from 'react';
import { ICONS } from '../constants';
import { Booking } from '../types';

interface DashboardProps {
  bookings: Booking[];
  onBookNew: () => void;
  onManageBooking: (booking: Booking) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ bookings, onBookNew, onManageBooking }) => {
  return (
    <div className="max-w-7xl mx-auto w-full p-6 md:p-12 lg:p-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-3">
          <div className="inline-block px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-md">
            Management Portal
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">Upcoming Sessions</h2>
          <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 font-medium">Your high-precision strategy queue.</p>
        </div>
        <button
          onClick={onBookNew}
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl font-black transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg shadow-purple-200 dark:shadow-none"
        >
          <ICONS.Calendar className="w-5 h-5" />
          Book New Session
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-zinc-50/40 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-12 md:p-24 text-center animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-md border border-zinc-50 dark:border-zinc-800">
            <ICONS.Calendar className="w-10 h-10 text-zinc-200 dark:text-zinc-800" />
          </div>
          <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-3">Empty Slot Queue</h3>
          <p className="text-zinc-500 mb-10 max-w-sm mx-auto text-base font-medium leading-relaxed">
            You don't have any upcoming sessions. Reserve your next precision slot now.
          </p>
          <button
            onClick={onBookNew}
            className="text-purple-600 font-black text-base hover:text-purple-800 transition-all flex items-center gap-2 mx-auto"
          >
            Check Availability <span className="text-xl">&rarr;</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div 
              key={booking.id}
              onClick={() => onManageBooking(booking)}
              className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-6 md:gap-10">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex flex-col items-center justify-center text-purple-600 dark:text-purple-300 font-black shrink-0">
                  <span className="text-[10px] uppercase tracking-widest mb-0.5">{new Date(booking.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                  <span className="text-2xl md:text-3xl leading-none tracking-tighter">{new Date(booking.date).getDate()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-zinc-900 dark:text-white text-xl md:text-2xl mb-1 truncate">{booking.sessionType}</h4>
                  <div className="flex flex-wrap items-center gap-4 text-zinc-400 text-xs font-bold">
                    <span className="flex items-center gap-2">
                      <ICONS.Clock className="w-4 h-4 opacity-60" />
                      {booking.startTime} - {booking.endTime}
                    </span>
                    <span className="hidden sm:block w-1 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full"></span>
                    <span className="text-purple-500 uppercase tracking-widest text-[10px]">{booking.duration} Hour Session</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6 mt-6 md:mt-0 self-end md:self-auto">
                <span className="px-4 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-[10px] font-black rounded-lg uppercase tracking-widest border border-green-100 dark:border-green-900/50">
                  Confirmed
                </span>
                <div className="w-10 h-10 rounded-xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                  <ICONS.ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
