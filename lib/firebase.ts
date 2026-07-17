import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCmk8w9WAWqqij-aNPPpfkrUYLGlXSXcpE",
  authDomain: "arenaos-a68cd.firebaseapp.com",
  databaseURL: "https://arenaos-a68cd-default-rtdb.firebaseio.com",
  projectId: "arenaos-a68cd",
  storageBucket: "arenaos-a68cd.firebasestorage.app",
  messagingSenderId: "447487826953",
  appId: "1:447487826953:web:b728b20b4fb566ad70ecd8",
  measurementId: "G-F80TL1HMBY"
};

// Initialize Firebase app instance safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Firebase Analytics (client-only, SSR guard)
let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, analytics };
export default app;
