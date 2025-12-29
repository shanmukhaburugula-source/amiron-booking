
import React, { useState } from 'react';
import { User } from '../types';
import { ICONS } from '../constants';
import { updateFirestoreUser, deleteUserAccount } from '../services/userService';

interface ProfileModalProps {
  user: User;
  onClose: () => void;
  onUpdate: (updatedUser: Partial<User>) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose, onUpdate }) => {
  const [name, setName] = useState(user.name);
  const [photoFileName, setPhotoFileName] = useState(user.photoFileName || "default_profile.png");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await updateFirestoreUser(user.id, { name, photoFileName });
      onUpdate({ name, photoFileName });
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteUserAccount(user.id);
      window.location.reload(); // Simplest way to clear state and redirect to auth
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-zinc-100 dark:border-zinc-800">
        <div className="p-10">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">Profile Settings</h3>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium">Manage your personal information.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-full transition-all">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-zinc-400"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl text-red-600 text-sm font-bold">
              {error}
            </div>
          )}

          {!showDeleteConfirm ? (
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="flex flex-col items-center gap-6 mb-10">
                <div className="w-32 h-32 bg-purple-50 dark:bg-purple-900/20 rounded-[2.5rem] flex items-center justify-center border-4 border-white dark:border-zinc-800 shadow-xl text-5xl text-purple-600 dark:text-purple-300 font-black">
                  {name.charAt(0).toUpperCase()}
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-zinc-300 dark:text-zinc-700 uppercase tracking-widest mb-1">Profile Photo</p>
                  <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400">{photoFileName}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="group">
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 text-sm font-medium transition-all"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="group opacity-60">
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 ml-1">Email (Read Only)</label>
                  <input
                    type="email"
                    disabled
                    className="w-full px-5 py-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-sm font-medium cursor-not-allowed"
                    value={user.email}
                  />
                </div>
              </div>

              <div className="pt-6 space-y-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-zinc-900 dark:bg-purple-600 hover:bg-black dark:hover:bg-purple-700 text-white font-black rounded-2xl shadow-xl transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? 'Saving Changes...' : 'Save Profile'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full py-4 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all"
                >
                  Delete My Account
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-8 py-4 animate-in slide-in-from-bottom-4 duration-300">
              <div className="p-8 bg-red-50 dark:bg-red-900/10 rounded-[2rem] border border-red-100 dark:border-red-900/20 text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4m0 4h.01"/></svg>
                </div>
                <h4 className="text-xl font-black text-red-800 dark:text-red-400 mb-2">Are you absolutely sure?</h4>
                <p className="text-sm text-red-600 dark:text-red-500/80 font-medium">
                  This will permanently delete your account and all associated booking history. This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-5 bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold rounded-2xl hover:bg-zinc-100 transition-all"
                >
                  No, Go Back
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 py-5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Confirm Delete'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
