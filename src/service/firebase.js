import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getFirestore } from "firebase/firestore";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  setDoc,
  addDoc,
  query,
  where,
  orderBy,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT
};

// Initialize Firebase

const app = firebase.initializeApp(firebaseConfig);
export const db = getFirestore(app);
export { doc, collection, getDoc, addDoc, getDocs, setDoc, query, where, orderBy, updateDoc, serverTimestamp };
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.addScope("email");
provider.addScope("profile");
export const signInWithGoogle = async () => await signInWithPopup(auth, provider);

export default firebase;
