import React, { useState } from 'react';
import { useAuth } from '../src/firebase/useAuth';
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signOut,
} from '../src/firebase/authService';

type AuthMode = 'login' | 'signup' | 'methods';

const LoginLogout: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const [mode, setMode] = useState<AuthMode>('methods');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return <div className="text-sm text-slate-500">Loading...</div>;
  }

  if (currentUser) {
    const handleLogout = async () => {
      try {
        setError(null);
        await signOut();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Logout failed');
      }
    };

    return (
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            {currentUser.displayName || currentUser.email}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      setIsSubmitting(true);
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setIsSubmitting(true);

      if (mode === 'login') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }

      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : `${mode} failed`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (mode === 'methods') {
    return (
      <div className="flex flex-col gap-3">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}
        <button
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          Sign in with Google
        </button>
        <button
          onClick={() => setMode('login')}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Email & Password Login
        </button>
        <button
          onClick={() => setMode('signup')}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Email & Password Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleEmailAuth} className="flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Processing...' : mode === 'login' ? 'Login' : 'Sign Up'}
        </button>
      </form>
      <button
        onClick={() => setMode('methods')}
        className="px-4 py-2 text-slate-600 dark:text-slate-400 text-sm hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        Back to methods
      </button>
    </div>
  );
};

export default LoginLogout;
