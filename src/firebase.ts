import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer,
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { Booking, Haircut, Professional, User } from './types';

// Initialize the Firebase core client
const app = initializeApp(firebaseConfig);

// CRITICAL: The app will break without specifying the custom firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();

// Test Connection on initial boot as requested by the guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

// Mandatory Error Parsing conforming to guidelines
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Collection References
const USERS_COL = 'users';
const HAIRCUTS_COL = 'haircuts';
const BARBERS_COL = 'barbers';
const BOOKINGS_COL = 'bookings';

// --- Users Firestore helper operations ---
export async function fetchUsersFromDb(): Promise<User[]> {
  try {
    const querySnapshot = await getDocs(collection(db, USERS_COL));
    const list: User[] = [];
    querySnapshot.forEach((docSnap) => {
      list.push(docSnap.data() as User);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, USERS_COL);
    return [];
  }
}

export async function saveUserToDb(user: User): Promise<void> {
  try {
    await setDoc(doc(db, USERS_COL, user.id || 'u_' + Date.now()), user);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${USERS_COL}/${user.id}`);
  }
}

export async function deleteUserFromDb(userId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, USERS_COL, userId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${USERS_COL}/${userId}`);
  }
}

// --- Haircuts (Services Catalog) operations ---
export async function fetchHaircutsFromDb(): Promise<Haircut[]> {
  try {
    const querySnapshot = await getDocs(collection(db, HAIRCUTS_COL));
    const list: Haircut[] = [];
    querySnapshot.forEach((docSnap) => {
      list.push(docSnap.data() as Haircut);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, HAIRCUTS_COL);
    return [];
  }
}

export async function saveHaircutToDb(haircut: Haircut): Promise<void> {
  try {
    await setDoc(doc(db, HAIRCUTS_COL, haircut.id), haircut);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${HAIRCUTS_COL}/${haircut.id}`);
  }
}

export async function deleteHaircutFromDb(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, HAIRCUTS_COL, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${HAIRCUTS_COL}/${id}`);
  }
}

// --- Barbers (Professionals) operations ---
export async function fetchBarbersFromDb(): Promise<Professional[]> {
  try {
    const querySnapshot = await getDocs(collection(db, BARBERS_COL));
    const list: Professional[] = [];
    querySnapshot.forEach((docSnap) => {
      list.push(docSnap.data() as Professional);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, BARBERS_COL);
    return [];
  }
}

export async function saveBarberToDb(barber: Professional): Promise<void> {
  try {
    await setDoc(doc(db, BARBERS_COL, barber.id), barber);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${BARBERS_COL}/${barber.id}`);
  }
}

export async function deleteBarberFromDb(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, BARBERS_COL, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${BARBERS_COL}/${id}`);
  }
}

// --- Bookings (Appointments) operations ---
export async function fetchBookingsFromDb(): Promise<Booking[]> {
  try {
    const querySnapshot = await getDocs(collection(db, BOOKINGS_COL));
    const list: Booking[] = [];
    querySnapshot.forEach((docSnap) => {
      list.push(docSnap.data() as Booking);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, BOOKINGS_COL);
    return [];
  }
}

export async function saveBookingToDb(booking: Booking): Promise<void> {
  try {
    await setDoc(doc(db, BOOKINGS_COL, booking.id), booking);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${BOOKINGS_COL}/${booking.id}`);
  }
}

export async function deleteBookingFromDb(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, BOOKINGS_COL, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${BOOKINGS_COL}/${id}`);
  }
}
