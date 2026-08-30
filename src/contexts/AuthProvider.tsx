import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";
import { AuthContext } from "@/contexts/AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const { data, error } =
        await supabase.auth.getSession();

      if (error) {
        console.error(
          "Erro ao carregar sessão:",
          error,
        );
      }

      if (!mounted) {
        return;
      }

      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      },
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}