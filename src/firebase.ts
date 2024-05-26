import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_o1DOhzpLmssIq0Q6YbvKb6e4t9Ee-qo",
  authDomain: "pixel-battle-4d880.firebaseapp.com",
  projectId: "pixel-battle-4d880",
  storageBucket: "pixel-battle-4d880.appspot.com",
  messagingSenderId: "488522611487",
  appId: "1:488522611487:web:dc36130a19c252d5f28e2a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };