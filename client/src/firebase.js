// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "property-hub-b6692.firebaseapp.com",
  projectId: "property-hub-b6692",
  storageBucket: "property-hub-b6692.appspot.com",
  messagingSenderId: "92356580326",
  appId: "1:92356580326:web:2400b5231a48443c10fc27",
  measurementId: "G-GBRLZ9BYEL"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);