import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

export interface ServiceRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  phoneNumber?: string;
  serviceType: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Rejected';
  createdAt: Timestamp;
}

export type ServiceRequestInput = Omit<ServiceRequest, 'id' | 'createdAt'>;

/**
 * Submit a new service request
 */
export const submitServiceRequest = async (
  userId: string,
  userEmail: string,
  userName: string,
  serviceType: string,
  description: string,
  phoneNumber?: string
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'serviceRequests'), {
      userId,
      userEmail,
      userName,
      phoneNumber: phoneNumber || null,
      serviceType,
      description,
      status: 'Pending',
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error submitting service request:', error);
    throw error;
  }
};

/**
 * Get all service requests for a specific user
 */
export const getUserRequests = async (userId: string): Promise<ServiceRequest[]> => {
  try {
    const q = query(
      collection(db, 'serviceRequests'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const requests = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as ServiceRequest));
    return requests.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
  } catch (error) {
    console.error('Error fetching user requests:', error);
    throw error;
  }
};

/**
 * Get all service requests (Admin only)
 */
export const getAllRequests = async (): Promise<ServiceRequest[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'serviceRequests'));
    const requests = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as ServiceRequest));
    return requests.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
  } catch (error) {
    console.error('Error fetching all requests:', error);
    throw error;
  }
};

/**
 * Update the status of a service request (Admin only)
 */
export const updateRequestStatus = async (
  requestId: string,
  status: 'Pending' | 'In Progress' | 'Completed' | 'Rejected'
): Promise<void> => {
  try {
    const requestRef = doc(db, 'serviceRequests', requestId);
    await updateDoc(requestRef, { status });
  } catch (error) {
    console.error('Error updating request status:', error);
    throw error;
  }
};

/**
 * Subscribe to user requests in real-time
 */
export const subscribeToUserRequests = (
  userId: string,
  callback: (requests: ServiceRequest[]) => void
): (() => void) => {
  try {
    const q = query(
      collection(db, 'serviceRequests'),
      where('userId', '==', userId)
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const requests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as ServiceRequest));
      callback(requests.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()));
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to user requests:', error);
    throw error;
  }
};

/**
 * Subscribe to all requests in real-time (Admin only)
 */
export const subscribeToAllRequests = (
  callback: (requests: ServiceRequest[]) => void
): (() => void) => {
  try {
    const unsubscribe = onSnapshot(collection(db, 'serviceRequests'), (querySnapshot) => {
      const requests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as ServiceRequest));
      callback(requests.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()));
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to all requests:', error);
    throw error;
  }
};
