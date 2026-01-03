import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";


export const loginWithGoogle = () =>
  signInWithPopup(auth, googleProvider);


export const signupWithEmail = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);


export const loginWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);


export const logout = () => signOut(auth);
