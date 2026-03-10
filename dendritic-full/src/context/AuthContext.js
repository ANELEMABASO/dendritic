// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut,
  signInWithPopup, updateProfile, sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { getVendor, createVendor } from '../firebase/db';
import toast from 'react-hot-toast';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [vendor,  setVendor]  = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const v = await getVendor(u.uid);
        setVendor(v);
      } else {
        setVendor(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const signUp = async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    toast.success(`Welcome to Dendritic, ${displayName}! 🎉`);
    return cred;
  };

  const signIn = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    toast.success(`Welcome back, ${cred.user.displayName || 'Vendor'}! 👋`);
    return cred;
  };

  const signInWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    const v = await getVendor(cred.user.uid);
    setVendor(v);
    toast.success(`Signed in as ${cred.user.displayName} 🚀`);
    return cred;
  };

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
    toast.success('Password reset email sent! Check your inbox.');
  };

  const logout = async () => {
    await signOut(auth);
    setVendor(null);
    toast('Signed out. See you soon! 👋', { icon: '🚚' });
  };

  const registerVendor = async (data) => {
    if (!user) return;
    await createVendor(user.uid, { ...data, email: user.email, displayName: user.displayName });
    const v = await getVendor(user.uid);
    setVendor(v);
    toast.success("Business registered! We'll review it shortly. 🎊");
  };

  const refreshVendor = async () => {
    if (!user) return;
    const v = await getVendor(user.uid);
    setVendor(v);
  };

  return (
    <AuthContext.Provider value={{
      user, vendor, loading,
      signUp, signIn, signInWithGoogle,
      resetPassword, logout,
      registerVendor, refreshVendor,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
