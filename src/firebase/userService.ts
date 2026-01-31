import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from './firebase';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  mobileNumber: string;
  createdAt: any;
  updatedAt?: any;
}

// Check if user profile exists
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (err) {
    console.error('Error fetching user profile:', err);
    throw err;
  }
};

// Create new user profile
export const createUserProfile = async (user: User): Promise<UserProfile> => {
  try {
    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      name: user.displayName || '',
      mobileNumber: '',
      createdAt: serverTimestamp(),
    };

    const docRef = doc(db, 'users', user.uid);
    await setDoc(docRef, newProfile);
    
    return newProfile;
  } catch (err) {
    console.error('Error creating user profile:', err);
    throw err;
  }
};

// Update user profile
export const updateUserProfile = async (
  uid: string,
  data: Partial<UserProfile>
): Promise<void> => {
  try {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('Error updating user profile:', err);
    throw err;
  }
};
