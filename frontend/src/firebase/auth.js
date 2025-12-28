import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";

// Google login
export const loginWithGoogle = () =>
  signInWithPopup(auth, googleProvider);

// Email signup
export const signupWithEmail = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

// Email login
export const loginWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

// Logout
export const logout = () => signOut(auth);
