
import React, { useState, useEffect } from 'react';
import { AuthProvider } from './src/firebase/AuthContext';
import { useAuth } from './src/firebase/useAuth';
import { initEmailJS } from './src/services/emailService';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServiceCard from './components/ServiceCard';
import RequestForm from './components/RequestForm';
import EditProfile from './components/EditProfile';
import Login from './components/Login';
import MyRequests from './src/components/MyRequests';
import AdminDashboard from './src/components/AdminDashboard';
import { PROJECT_SERVICES, SMALL_SERVICES, VALUES } from './constants';
import { ServiceId } from './types';

const AppContent: React.FC<{ theme: 'light' | 'dark'; toggleTheme: () => void }> = ({ theme, toggleTheme }) => {
  const { currentUser, loading, showProfileModal, setShowProfileModal, userProfile, refreshProfile } = useAuth();
  const [selectedService, setSelectedService] = useState<ServiceId | ''>('');
  const [currentPage, setCurrentPage] = useState<'home' | 'my-requests' | 'admin-dashboard'>('home');

  // Initialize EmailJS on component mount
  useEffect(() => {
    initEmailJS();
  }, []);

  const handleServiceSelect = (id: ServiceId) => {
    setSelectedService(id);
    const element = document.getElementById('request');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as 'home' | 'my-requests' | 'admin-dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in - show login page
  if (!currentUser) {
    return <Login />;
  }

  // First-time user needs to complete profile
  if (showProfileModal && userProfile) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full">
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Welcome! Complete Your Profile
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Please provide your information to get started
              </p>
            </div>
            <EditProfile
              profile={userProfile}
              onClose={() => setShowProfileModal(false)}
              onSave={async () => {
                await refreshProfile();
                setShowProfileModal(false);
              }}
              isNew={true}
            />
          </div>
        </div>
      </div>
    );
  }

  // Render different pages based on currentPage
  if (currentPage === 'my-requests') {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
        <Navbar theme={theme} toggleTheme={toggleTheme} onNavigate={handleNavigate} />
        <MyRequests onBack={() => handleNavigate('home')} />
      </div>
    );
  }

  if (currentPage === 'admin-dashboard') {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
        <Navbar theme={theme} toggleTheme={toggleTheme} onNavigate={handleNavigate} />
        <AdminDashboard onBack={() => handleNavigate('home')} />
      </div>
    );
  }

  // Logged in with complete profile - show main app (home page)
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <>
        <Navbar theme={theme} toggleTheme={toggleTheme} onNavigate={handleNavigate} />
        
        {/* Hero Section */}
        <Hero />

      {/* Services Section */}
      <section id="services" className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <h2 className="text-sm font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-4">Our Expertise</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Expert Services for a Digital World</h3>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Kind-Bridge offers a diverse range of specialized services, categorized to meet both your large-scale project needs and small-scale technical support.
            </p>
          </div>
          
          {/* Project Services */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-10">
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white">Project Services</h4>
              <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {PROJECT_SERVICES.map((service) => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  onSelect={handleServiceSelect} 
                />
              ))}
            </div>
          </div>

          {/* Small Services */}
          <div>
            <div className="flex items-center gap-4 mb-10">
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white">Small Services</h4>
              <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {SMALL_SERVICES.map((service) => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  onSelect={handleServiceSelect} 
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">How It Works</h2>
            <p className="text-slate-600 dark:text-slate-400">Simplicity is at the heart of our process. Three steps to bridge your vision.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="text-center group">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100 dark:border-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-3 dark:text-white">Choose Service</h4>
              <p className="text-slate-600 dark:text-slate-400">Browse our expertise and select the bridge that fits your needs.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100 dark:border-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-3 dark:text-white">Share Requirement</h4>
              <p className="text-slate-600 dark:text-slate-400">Tell us your vision. We listen with care and technical precision.</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100 dark:border-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-3 dark:text-white">We Deliver with Care</h4>
              <p className="text-slate-600 dark:text-slate-400">Sit back as we craft and deliver high-impact results directly to you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why-us" className="py-24 bg-white dark:bg-slate-950 overflow-hidden relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-sm font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-4">Why Choose Us</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-8">The Human Element in Digital Excellence</h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                We believe that behind every line of code, every design pixel, and every academic paper, there is a human intent. Our mission is to honor that intent with trust, care, and professional mastery.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {VALUES.map((val, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                      {val.icon}
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white mb-1">{val.title}</h5>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{val.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex-1 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform rotate-2">
                <img 
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800&h=1000" 
                  alt="Team at work"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-blue-600/10 hover:bg-transparent transition-colors duration-500"></div>
              </div>
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-100 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20 -z-10 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Request Section */}
      <section id="request" className="py-24 bg-slate-900 dark:bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/10 blur-[120px] rounded-full"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Bridge the Gap?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Tell us about your next project or requirement. Whether it's a complex tech build or personalized tuition, we're here to help.
            </p>
          </div>

          <RequestForm initialService={selectedService} />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">K</div>
                <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Kind-Bridge
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8">
                Connecting humanity to technology, creativity, and education with unwavering trust. We are your partner in digital growth.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <a href="mailto:pavankumar.consult@gmail.com" className="hover:text-blue-600 transition-colors">pavankumar.consult@gmail.com</a>
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <a href="tel:+917893504891" className="hover:text-blue-600 transition-colors">+91 7893504891</a>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
              <ul className="space-y-4 text-slate-600 dark:text-slate-400 font-medium">
                <li><a href="#services" className="hover:text-blue-600 transition-colors">Services</a></li>
                <li><a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a></li>
                <li><a href="#why-us" className="hover:text-blue-600 transition-colors">About Us</a></li>
                <li><a href="#request" className="hover:text-blue-600 transition-colors">Get Started</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Follow Us</h4>
              <div className="grid grid-cols-2 gap-4">
                <a href="https://www.linkedin.com/in/pavan-kumar-chintapalli" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  <span className="text-xs">LinkedIn</span>
                </a>
                <a href="https://instagram.com/pavan_kumar_hari" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-pink-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 0.013-3.583 0.07-4.849 0.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  <span className="text-xs">Instagram</span>
                </a>
                <a href="https://t.me/Pavan_Kumar_Hari" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.891 7c.147 0 .299.038.408.134.107.094.155.23.143.362l-.001.014c-.154 1.613-.798 5.407-1.129 7.172-.141.748-.423 1.0-.694 1.025-.588.056-1.032-.385-1.6-.756-.889-.581-1.391-.941-2.254-1.509-1-.657-.354-1.019.218-1.612.15-.155 2.748-2.518 2.798-2.731.006-.026.012-.124-.047-.177-.058-.052-.144-.035-.205-.021-.088.019-1.493.946-4.214 2.785-.399.274-.759.41-1.08.403-.355-.008-1.039-.201-1.548-.366-.624-.203-1.119-.311-1.076-.656.022-.18.271-.365.747-.556 2.924-1.272 4.873-2.112 5.847-2.52 2.776-1.164 3.352-1.366 3.73-1.373z"/></svg>
                  <span className="text-xs">Telegram</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-50 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 gap-4">
            <p>© 2024 Kind-Bridge Inc. All rights reserved.</p>
            <p>Built with care by Pavan Kumar Chintapalli.</p>
          </div>
        </div>
      </footer>
      </>
    </div>
  );
};


const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <AuthProvider>
      <AppContent theme={theme} toggleTheme={toggleTheme} />
    </AuthProvider>
  );
};

export default App;

