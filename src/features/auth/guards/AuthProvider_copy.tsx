import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase.ts";
import type { Session, User } from "@supabase/supabase-js";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      try {
        // Sicherer, serverseitig verifizierter Abruf des aktuellen Users
        const { data: { user: verifiedUser }, error } = await supabase.auth.getUser();

        if (isMounted) {
          if (error || !verifiedUser) {
            // Token ist ungültig oder abgelaufen -> ausloggen und aufräumen
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
          } else {
            // Session aus dem lokalen Speicher holen (passend zum verifizierten User)
            const { data: { session: localSession } } = await supabase.auth.getSession();
            setSession(localSession);
            setUser(verifiedUser);
          }
        }
      } catch (err) {
          console.error("Fehler bei der Auth-Initialisierung:", err);
        if (isMounted) {
          setSession(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initializeAuth();

    // Event-Listener für zukünftige Änderungen (Login, Logout, Token-Refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      // WICHTIG: Überspringe das INITIAL_SESSION Event von onAuthStateChange,
      // da unsere initializeAuth()-Funktion das bereits sicherer (via getUser) übernimmt.
      if (event === "INITIAL_SESSION") return;

      if (isMounted) {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false; // Verhindert State-Updates auf unmontierten Komponenten
      subscription.unsubscribe();
    };
  }, []);

  return (
      <AuthContext.Provider value={{ session, user, loading }}>
        {children}
      </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  // 2. Sicherheitscheck: Wirft sofort einen klaren Fehler, wenn der Hook falsch platziert ist
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}