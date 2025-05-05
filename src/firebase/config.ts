import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// Replace with your own Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAUmVqFaj6nkXy_ksSLDdLCUQ62BTTwVN4",
  authDomain: "trabalho-web-bda6d.firebaseapp.com",
  projectId: "trabalho-web-bda6d",
  storageBucket: "trabalho-web-bda6d.firebasestorage.app",
  messagingSenderId: "428485254693",
  appId: "1:428485254693:web:7a32055b32b104b74ea9cc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;