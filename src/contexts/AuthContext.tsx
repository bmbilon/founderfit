/**
 * FounderFit Score v2.1
 * Authentication Context
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import type { Founder } from '@/types';
import { onAuthStateChange, getCurrentUser, getCurrentFounder } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  founder: Founder | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshFounder: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [founder, setFounder] = useState<Founder | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshFounder = async () => {
    try {
      const founderData = await getCurrentFounder();
      setFounder(founderData);
    } catch (error) {
      console.error('Error refreshing founder:', error);
    }
  };

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        if (currentUser) {
          const founderData = await getCurrentFounder();
          setFounder(founderData);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const unsubscribe = onAuthStateChange(async (newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        const founderData = await getCurrentFounder();
        setFounder(founderData);
      } else {
        setFounder(null);
      }

      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const { signOut: supabaseSignOut } = await import('@/lib/auth');
    await supabaseSignOut();
    setUser(null);
    setFounder(null);
    setSession(null);
  };

  const isAdmin = founder?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        founder,
        session,
        loading,
        isAdmin,
        signOut: handleSignOut,
        refreshFounder,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
