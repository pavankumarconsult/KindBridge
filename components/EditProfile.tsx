import React, { useState, useEffect } from 'react';
import { useAuth } from '../src/firebase/useAuth';
import { updateUserProfile, UserProfile } from '../src/firebase/userService';

interface EditProfileProps {
  profile: UserProfile;
  onClose?: () => void;
  onSave?: () => void;
  isNew?: boolean;
}

const EditProfile: React.FC<EditProfileProps> = ({ profile, onClose, onSave, isNew = false }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: profile.name,
    mobileNumber: profile.mobileNumber,
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.uid) return;

    try {
      setError(null);
      setIsSubmitting(true);

      await updateUserProfile(currentUser.uid, {
        name: formData.name,
        mobileNumber: formData.mobileNumber,
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (onSave) onSave();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-8 max-w-md w-full">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        {isNew ? 'Complete Your Profile' : 'Edit Profile'}
      </h2>
      {isNew && (
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Welcome! Please confirm your name and optionally add your mobile number.
        </p>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400 text-sm">
          Profile updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Mobile Number Field */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Mobile Number (optional)
          </label>
          <input
            type="tel"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Email Field (Read-only) */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={profile.email}
            disabled
            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 cursor-not-allowed opacity-75"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Email address cannot be changed here
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : isNew ? 'Get Started' : 'Save Changes'}
          </button>
          {!isNew && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-medium rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
