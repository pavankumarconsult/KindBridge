import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  ConfirmationResult,
} from 'firebase/auth';
import { auth } from './firebase';

// Google Sign-In
export const signInWithGoogle = async (): Promise<void> => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
};

// Phone Number Sign-In - Step 1: Send OTP
export const signInWithPhoneStart = async (
  phoneNumber: string,
  appVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> => {
  return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};

// Phone Number Sign-In - Step 2: Verify OTP
export const signInWithPhoneVerify = async (
  confirmationResult: ConfirmationResult,
  otp: string
): Promise<void> => {
  await confirmationResult.confirm(otp);
};

// Email & Password - Sign Up
export const signUpWithEmail = async (email: string, password: string): Promise<void> => {
  await createUserWithEmailAndPassword(auth, email, password);
};

// Email & Password - Login
export const signInWithEmail = async (email: string, password: string): Promise<void> => {
  await signInWithEmailAndPassword(auth, email, password);
};

// Sign Out
export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};
