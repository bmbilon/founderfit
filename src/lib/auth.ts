/**
 * FounderFit Score v2.1
 * Authentication Utilities
 */

import { supabase } from './supabase';
import type { User, Session } from '@supabase/supabase-js';
import type { Founder, UserRole } from '@/types';

// ============================================================================
// AUTH OPERATIONS
// ============================================================================

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

/**
 * Sign up a new user
 */
export async function signUp(data: SignUpData) {
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
        role: 'founder',
      },
    },
  });

  if (error) throw error;
  return authData;
}

/**
 * Sign in an existing user
 */
export async function signIn(data: SignInData) {
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) throw error;
  return authData;
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Get the current session
 */
export async function getSession(): Promise<Session | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

/**
 * Get the current user
 */
export async function getCurrentUser(): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) throw error;
}

/**
 * Update password
 */
export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
}

// ============================================================================
// FOUNDER PROFILE OPERATIONS
// ============================================================================

/**
 * Get the founder profile for the current user
 */
export async function getCurrentFounder(): Promise<Founder | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('founders')
    .select('*')
    .eq('auth_user_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching founder profile:', error);
    return null;
  }

  return data;
}

/**
 * Update founder profile
 */
export async function updateFounderProfile(founderId: string, updates: { name?: string }) {
  const { data, error } = await supabase
    .from('founders')
    // @ts-ignore - Supabase type inference issue
    .update(updates)
    .eq('id', founderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const founder = await getCurrentFounder();
  return founder?.role === 'admin';
}

/**
 * Get user role
 */
export async function getUserRole(): Promise<UserRole | null> {
  const founder = await getCurrentFounder();
  return founder?.role ?? null;
}

// ============================================================================
// AUTH STATE LISTENERS
// ============================================================================

export type AuthChangeCallback = (session: Session | null) => void;

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(callback: AuthChangeCallback) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });

  return () => {
    subscription.unsubscribe();
  };
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * Minimum 8 characters
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

/**
 * Get password strength message
 */
export function getPasswordStrengthMessage(password: string): string {
  if (password.length === 0) return '';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (password.length < 12) return 'Password strength: Moderate';
  return 'Password strength: Strong';
}
