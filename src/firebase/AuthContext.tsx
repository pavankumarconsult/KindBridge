import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { getUserProfile, createUserProfile, UserProfile } from './userService';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  userProfile: UserProfile | null;
  showProfileModal: boolean;
  setShowProfileModal: (show: boolean) => void;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const refreshProfile = async () => {
    if (!currentUser) return;

    try {
      const profile = await getUserProfile(currentUser.uid);
      setUserProfile(profile);
    } catch (err) {
      console.error('Error refreshing profile:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          // Check if profile exists
          const profile = await getUserProfile(user.uid);

          if (profile) {
            // Profile exists
            setUserProfile(profile);
            setShowProfileModal(false);
          } else {
            // First time login - create profile and show modal
            const newProfile = await createUserProfile(user);
            setUserProfile(newProfile);
            setShowProfileModal(true);
          }
        } catch (err) {
          console.error('Error checking user profile:', err);
        }
      } else {
        setUserProfile(null);
        setShowProfileModal(false);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    userProfile,
    showProfileModal,
    setShowProfileModal,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
