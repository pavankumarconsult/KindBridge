
import React, { useState, useEffect } from 'react';
import ProfileButton from './ProfileButton';
import { useAuth } from '../src/firebase/useAuth';

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onNavigate: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentUser, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src="/logo.png" alt="Kind-Bridge Logo" className="w-8 h-8 rounded-lg" />
          <span className={`text-xl font-bold tracking-tight ${isScrolled ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-white'}`}>
            Kind-Bridge
          </span>
        </button>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#services" className="hover:text-blue-600 transition-colors dark:text-slate-300 dark:hover:text-blue-400">Services</a>
          <a href="#how-it-works" className="hover:text-blue-600 transition-colors dark:text-slate-300 dark:hover:text-blue-400">How It Works</a>
          <a href="#why-us" className="hover:text-blue-600 transition-colors dark:text-slate-300 dark:hover:text-blue-400">About Us</a>
          
          <div className="flex items-center gap-4 border-l border-slate-200 dark:border-slate-800 pl-8">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
              )}
            </button>

            {/* Show My Requests and Admin Dashboard buttons if logged in */}
            {currentUser && (
              <>
                <button 
                  onClick={() => onNavigate('my-requests')}
                  className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-900 dark:text-white text-sm font-medium"
                >
                  My Requests
                </button>
                
                {isAdmin && (
                  <button 
                    onClick={() => onNavigate('admin-dashboard')}
                    className="px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-purple-600 dark:text-purple-400 text-sm font-medium border border-purple-300 dark:border-purple-700"
                  >
                    Admin Dashboard
                  </button>
                )}
              </>
            )}

            {/* Auth Component */}
            <ProfileButton isDark={theme === 'dark'} />

            <a href="#request" className="bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 shadow-md shadow-blue-500/20">
              Get Started
            </a>
          </div>
        </div>

        <div className="md:hidden flex items-center gap-2">
           <button onClick={toggleTheme} className="p-2 rounded-full text-slate-600 dark:text-slate-400">
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
              )}
           </button>
           <button className="text-slate-900 dark:text-white">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
             </svg>
           </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
