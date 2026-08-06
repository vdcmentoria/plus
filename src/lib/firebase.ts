import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Connectivity check as per instructions
export async function checkConnection() {
  if (typeof window !== 'undefined') {
    if ((window as any).isFirestoreQuotaExceeded || sessionStorage.getItem('firestore_quota_exceeded') === 'true') {
      return true; // Assume connected but over quota
    }
  }
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error: any) {
    if (error?.code === 'unavailable' || error?.message?.includes('the client is offline')) {
      console.error("Firestore connectivity check failed (offline):", error.message);
      return false;
    }
    if (error?.code === 'resource-exhausted' || error?.message?.includes('Quota exceeded')) {
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('firestore_quota_exceeded', 'true');
          (window as any).isFirestoreQuotaExceeded = true;
          window.dispatchEvent(new CustomEvent('firestore-quota-exceeded'));
        } catch (e) {}
      }
      return true;
    }
    // permission-denied or other server-side errors mean we ARE connected
    if (error?.code === 'permission-denied') {
      return true;
    }
    console.warn("Firestore connectivity check returned unexpected error (but server was reached):", error.message);
    return true;
  }
}
