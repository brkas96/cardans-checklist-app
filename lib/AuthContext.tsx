'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { auth, firestore } from './firebase';

interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  createUser: (email: string, password: string, role: 'admin' | 'user') => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      // No Firebase, use localStorage for auth
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.length === 0) {
        // Create default admin
        const defaultAdmin: UserProfile & { password: string } = {
          uid: 'admin',
          email: 'admin@admin.com',
          role: 'admin',
          password: 'admin',
        };
        localStorage.setItem('users', JSON.stringify([defaultAdmin]));
      }
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setProfile(parsedUser.profile);
      }
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth!, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Fetch user profile from Firestore
        if (firestore) {
          const userDoc = await getDoc(doc(firestore!, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setProfile(userDoc.data() as UserProfile);
          } else {
            // If no profile, create one with default role 'user'
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              role: 'user',
            };
            await setDoc(doc(firestore!, 'users', firebaseUser.uid), newProfile);
            setProfile(newProfile);
          }
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe?.();
  }, []);

  const login = async (email: string, password: string) => {
    if (!auth) {
      // Local login
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      if (foundUser) {
        const userObj = { uid: foundUser.uid, email: foundUser.email };
        setUser(userObj as User);
        setProfile(foundUser);
        localStorage.setItem('currentUser', JSON.stringify({ ...userObj, profile: foundUser }));
      } else {
        throw new Error('Credenciais inválidas');
      }
      return;
    }
    await signInWithEmailAndPassword(auth!, email, password);
  };

  const logout = async () => {
    if (!auth) {
      setUser(null);
      setProfile(null);
      localStorage.removeItem('currentUser');
      return;
    }
    await signOut(auth!);
  };

  const createUser = async (email: string, password: string, role: 'admin' | 'user') => {
    if (!auth || !firestore) {
      // Local create user
      if (profile?.role !== 'admin') {
        throw new Error('Apenas administradores podem criar usuários');
      }
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.some((u: any) => u.email === email)) {
        throw new Error('Usuário já existe');
      }
      const newUser: UserProfile & { password: string } = {
        uid: Date.now().toString(),
        email,
        role,
        password,
      };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      return;
    }
    const { collection, getDocs } = await import('firebase/firestore');
    const usersRef = collection(firestore!, 'users');
    const usersSnapshot = await getDocs(usersRef);
    if (!usersSnapshot.empty && profile?.role !== 'admin') {
      throw new Error('Apenas administradores podem criar usuários');
    }
    const userCredential = await createUserWithEmailAndPassword(auth!, email, password);
    const newProfile: UserProfile = {
      uid: userCredential.user.uid,
      email,
      role: usersSnapshot.empty ? 'admin' : role, // First user is admin
    };
    await setDoc(doc(firestore!, 'users', userCredential.user.uid), newProfile);
  };

  return (
    <AuthContext.Provider value={{ user, profile, login, logout, createUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};;;