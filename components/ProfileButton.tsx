import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../src/firebase/useAuth';
import { signOut } from '../src/firebase/authService';
import EditProfile from './EditProfile';

interface ProfileButtonProps {
  isDark?: boolean;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({ isDark = false }) => {
  const { currentUser, loading, userProfile, refreshProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  if (loading) {
    return <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />;
  }

  if (!currentUser) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await signOut();
      setIsOpen(false);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleEditProfile = () => {
    setShowEditProfile(true);
    setIsOpen(false);
  };

  const handleProfileSaved = async () => {
    setShowEditProfile(false);
    await refreshProfile();
  };

  const getInitials = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
    }
    return currentUser?.email?.[0].toUpperCase() || '?';
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Profile Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 rounded-full transition-colors ${
            isDark
              ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
              : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
          aria-label="Account menu"
        >
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {getInitials()}
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className={`absolute right-0 mt-2 w-72 rounded-lg shadow-xl border z-50 ${
            isDark
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-slate-200'
          }`}>
            <div className="p-4">
              {/* User Info Section */}
              <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                    {getInitials()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {userProfile?.name || currentUser.displayName || 'User'}
                    </p>
                    <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {currentUser.email}
                    </p>
                  </div>
                </div>

                {/* Profile Details */}
                <div className={`space-y-2 text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {userProfile?.mobileNumber && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{userProfile.mobileNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={handleEditProfile}
                  className={`w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    isDark
                      ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className={`w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    isDark
                      ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                      : 'bg-red-50 text-red-600 hover:bg-red-100'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && userProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-xl shadow-2xl ${
            isDark ? 'bg-slate-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <EditProfile
                profile={userProfile}
                onClose={() => setShowEditProfile(false)}
                onSave={handleProfileSaved}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileButton;
