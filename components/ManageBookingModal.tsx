
import React, { useState } from 'react';
import { ICONS } from '../constants';
import { Booking } from '../types';

interface ManageBookingModalProps {
  booking: Booking;
  onClose: () => void;
  onCancel: (id: string) => void;
  onReschedule: (id: string) => void;
}

const ManageBookingModal: React.FC<ManageBookingModalProps> = ({ booking, onClose, onCancel, onReschedule }) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 overflow-hidden animate-in fade-in zoom-in duration-300 border border-zinc-100 dark:border-zinc-800">
        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Manage Session</h3>
        <p className="text-zinc-500 dark:text-zinc-400 mb-10 text-sm leading-relaxed">
          Adjust your reservation for the <strong>{booking.sessionType}</strong> on <strong>{new Date(booking.date).toLocaleDateString()}</strong>.
        </p>

        {!showCancelConfirm ? (
          <div className="space-y-4">
            <button
              onClick={() => onReschedule(booking.id)}
              className="w-full py-5 bg-[#f5f3ff] dark:bg-purple-900/20 text-[#a78bfa] dark:text-purple-300 font-bold rounded-2xl border border-[#ddd6fe] dark:border-purple-800/50 hover:bg-[#f3f0ff] dark:hover:bg-purple-900/30 transition-all flex items-center justify-center gap-3"
            >
              <ICONS.Calendar className="w-5 h-5" />
              Reschedule Session
            </button>
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="w-full py-5 bg-white dark:bg-zinc-900 text-red-400 dark:text-red-500 font-bold rounded-2xl border border-red-50 dark:border-red-900/20 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              Cancel Booking
            </button>
            <button
              onClick={onClose}
              className="w-full py-5 text-zinc-400 dark:text-zinc-600 font-medium hover:text-zinc-700 dark:hover:text-zinc-400 text-sm"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/20">
              <p className="text-red-700 dark:text-red-400 font-medium text-center text-sm">
                Cancel this reservation? This action is permanent and will release your slot.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-5 bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all"
              >
                No, Go Back
              </button>
              <button
                onClick={() => onCancel(booking.id)}
                className="flex-1 py-5 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-all shadow-lg shadow-red-100 dark:shadow-none"
              >
                Cancel Slot
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBookingModal;
