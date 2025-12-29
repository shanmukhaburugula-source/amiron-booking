
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
    <div className="max-w-7xl mx-auto w-full p-6 md:p-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-4">
          <div className="inline-block px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-md">
            Management Portal
          </div>
          <h2 className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">Upcoming Sessions</h2>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 font-medium">Your high-precision strategy queue.</p>
        </div>
        <button
          onClick={onBookNew}
          className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-5 rounded-[2rem] font-black transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-2xl shadow-purple-100 dark:shadow-none"
        >
          <ICONS.Calendar className="w-5 h-5" />
          Book New Session
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-zinc-50/40 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800 rounded-[3.5rem] p-16 md:p-32 text-center animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-white dark:bg-zinc-900 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-xl shadow-zinc-100/50 dark:shadow-none border border-zinc-50 dark:border-zinc-800">
            <ICONS.Calendar className="w-12 h-12 text-purple-200 dark:text-purple-900" />
          </div>
          <h3 className="text-3xl font-black text-zinc-900 dark:text-white mb-4">Empty Slot Queue</h3>
          <p className="text-zinc-400 mb-12 max-w-sm mx-auto text-lg font-medium leading-relaxed">
            You don't have any upcoming sessions. Reserve your next precision slot now.
          </p>
          <button
            onClick={onBookNew}
            className="text-purple-600 font-black text-lg hover:text-purple-800 transition-all flex items-center gap-2 mx-auto"
          >
            Check Availability <span className="text-2xl">&rarr;</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div 
              key={booking.id}
              onClick={() => onManageBooking(booking)}
              className="group bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-10 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:border-purple-200 dark:hover:border-purple-800 hover:shadow-2xl hover:shadow-purple-50 dark:hover:shadow-none transition-all duration-500"
            >
              <div className="flex items-center gap-10">
                <div className="w-20 h-20 bg-purple-50 dark:bg-purple-900/20 rounded-[1.75rem] flex flex-col items-center justify-center text-purple-500 dark:text-purple-300 font-black">
                  <span className="text-[11px] uppercase tracking-widest mb-1">{new Date(booking.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                  <span className="text-3xl leading-none tracking-tighter">{new Date(booking.date).getDate()}</span>
                </div>
                <div>
                  <h4 className="font-black text-zinc-900 dark:text-white text-2xl mb-2">{booking.sessionType}</h4>
                  <div className="flex flex-wrap items-center gap-6 text-zinc-400 text-sm font-bold">
                    <span className="flex items-center gap-2.5">
                      <ICONS.Clock className="w-5 h-5 opacity-60" />
                      {booking.startTime} - {booking.endTime}
                    </span>
                    <span className="w-1.5 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full"></span>
                    <span className="text-purple-400 uppercase tracking-widest text-[10px]">{booking.duration} Hour Session</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8 mt-6 md:mt-0 self-end md:self-auto">
                <span className="px-5 py-2 bg-green-50 dark:bg-green-900/20 text-green-500 dark:text-green-400 text-[10px] font-black rounded-xl uppercase tracking-widest border border-green-100 dark:border-green-900/50">
                  Confirmed
                </span>
                <div className="w-12 h-12 rounded-full border border-zinc-50 dark:border-zinc-800 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                  <ICONS.ChevronRight className="w-5 h-5" />
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
