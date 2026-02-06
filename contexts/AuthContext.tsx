'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { createBrowserClient, isSupabaseConfigured } from '@/lib/supabase';
import { useToast } from '@/contexts/ToastContext';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  refreshSession: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    const supabase = createBrowserClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured()) return;
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    showToast('You have been logged out successfully');
  }, [showToast]);

  const refreshSession = useCallback(async () => {
    if (!isSupabaseConfigured()) return;
    const supabase = createBrowserClient();
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}
