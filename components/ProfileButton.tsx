import React, { useState, useRef, useEffect } from 'react';
import { RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';
import { useAuth } from '../src/firebase/useAuth';
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signOut,
  signInWithPhoneStart,
  signInWithPhoneVerify,
} from '../src/firebase/authService';
import { auth } from '../src/firebase/firebase';
import EditProfile from './EditProfile';

type AuthMode = 'methods' | 'login' | 'signup' | 'phone' | 'phone-otp' | 'edit-profile';

interface ProfileButtonProps {
  isDark?: boolean;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({ isDark = false }) => {
  const { currentUser, loading, userProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('methods');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

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

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      setIsSubmitting(true);
      await signInWithGoogle();
      setIsOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneSignInStart = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter a valid phone number');
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);

      // Initialize reCAPTCHA verifier
      if (!recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {},
        });
      }

      const result = await signInWithPhoneStart(phoneNumber, recaptchaVerifierRef.current);
      setConfirmationResult(result);
      setAuthMode('phone-otp');
      setOtp('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
      recaptchaVerifierRef.current?.clear();
      recaptchaVerifierRef.current = null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!confirmationResult || !otp.trim()) {
      setError('Please enter the OTP code');
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);
      await signInWithPhoneVerify(confirmationResult, otp);
      setIsOpen(false);
      setPhoneNumber('');
      setOtp('');
      setConfirmationResult(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setIsSubmitting(true);

      if (authMode === 'login') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }

      setEmail('');
      setPassword('');
      setIsOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : `${authMode} failed`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      setError(null);
      await signOut();
      setIsOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
    }
  };

  // Get user initials for avatar
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
        {currentUser ? (
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {getInitials()}
          </div>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-64 rounded-lg shadow-lg border z-50 ${
          isDark
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-slate-200'
        }`}>
          <div className="p-4">
            {/* Error Message */}
            {error && (
              <div className={`mb-3 p-3 rounded-lg text-sm ${
                isDark
                  ? 'bg-red-900/20 border border-red-800 text-red-400'
                  : 'bg-red-50 border border-red-200 text-red-600'
              }`}>
                {error}
              </div>
            )}

            {/* Logged In State */}
            {currentUser ? (
              <div>
                <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {currentUser.displayName || 'Account'}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {currentUser.email}
                  </p>
                </div>
                {authMode === 'edit-profile' && userProfile ? (
                  <EditProfile
                    profile={userProfile}
                    onClose={() => setAuthMode('methods')}
                    onSave={() => {
                      setAuthMode('methods');
                      setError(null);
                    }}
                  />
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => setAuthMode('edit-profile')}
                      className={`w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isDark
                          ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                          : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      }`}
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className={`w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isDark
                          ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                          : 'bg-red-50 text-red-600 hover:bg-red-100'
                      }`}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : authMode === 'methods' ? (
              /* Auth Methods */
              <div className="space-y-2">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                  className={`w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isDark
                      ? 'bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-50'
                      : 'bg-slate-100 text-slate-900 hover:bg-slate-200 disabled:opacity-50'
                  }`}
                >
                  Sign in with Google
                </button>
                <button
                  onClick={() => setAuthMode('phone')}
                  className={`w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isDark
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  Sign in with Phone
                </button>
                <button
                  onClick={() => setAuthMode('login')}
                  className={`w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isDark
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Email & Password Login
                </button>
                <button
                  onClick={() => setAuthMode('signup')}
                  className={`w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isDark
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Email & Password Sign Up
                </button>
              </div>
            ) : authMode === 'phone' ? (
              /* Phone Sign In */
              <div>
                <form onSubmit={(e) => { e.preventDefault(); handlePhoneSignInStart(); }} className="space-y-3">
                  <div>
                    <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1234567890"
                      required
                      className={`w-full px-3 py-2 rounded-lg text-sm border transition-colors ${
                        isDark
                          ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/20'
                      }`}
                    />
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Include country code (e.g., +1 for USA)
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isDark
                        ? 'bg-green-600 text-white hover:bg-green-700 disabled:opacity-50'
                        : 'bg-green-600 text-white hover:bg-green-700 disabled:opacity-50'
                    }`}
                  >
                    {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </form>
                <button
                  onClick={() => { setAuthMode('methods'); setPhoneNumber(''); setError(null); }}
                  className={`w-full mt-3 px-3 py-2 text-xs transition-colors ${
                    isDark
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ← Back to methods
                </button>
                <div id="recaptcha-container" />
              </div>
            ) : authMode === 'phone-otp' ? (
              /* Phone OTP Verification */
              <div>
                <p className={`text-xs mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Enter the OTP sent to {phoneNumber}
                </p>
                <form onSubmit={handlePhoneOtpVerify} className="space-y-3">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    required
                    className={`w-full px-3 py-2 rounded-lg text-sm border text-center tracking-widest transition-colors ${
                      isDark
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/20'
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isDark
                        ? 'bg-green-600 text-white hover:bg-green-700 disabled:opacity-50'
                        : 'bg-green-600 text-white hover:bg-green-700 disabled:opacity-50'
                    }`}
                  >
                    {isSubmitting ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </form>
                <button
                  onClick={() => { setAuthMode('phone'); setOtp(''); setConfirmationResult(null); setError(null); }}
                  className={`w-full mt-3 px-3 py-2 text-xs transition-colors ${
                    isDark
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ← Change phone number
                </button>
              </div>
            ) : (
              /* Email Auth Form */
              <div>
                <form onSubmit={handleEmailAuth} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className={`w-full px-3 py-2 rounded-lg text-sm border transition-colors ${
                      isDark
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                    }`}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className={`w-full px-3 py-2 rounded-lg text-sm border transition-colors ${
                      isDark
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isDark
                        ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
                        : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
                    }`}
                  >
                    {isSubmitting ? 'Processing...' : authMode === 'login' ? 'Login' : 'Sign Up'}
                  </button>
                </form>
                <button
                  onClick={() => setAuthMode('methods')}
                  className={`w-full mt-3 px-3 py-2 text-xs transition-colors ${
                    isDark
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ← Back to methods
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileButton;
