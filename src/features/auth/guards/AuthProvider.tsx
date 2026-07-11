import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase.ts";
import type { Session } from "@supabase/supabase-js";

type AuthContextType = {
  session: Session | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
});

export function AuthProvider({
                               children,
                             }: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Fehler beim Laden der Session:", error.message);
        }

        setSession(data.session);
      } catch (err) {
        console.error("Unerwarteter Fehler beim Session-Check:", err);
      } finally {
        setLoading(false);
      }
    }

    init();

    // Reagiert auf Login, Logout, Token-Refresh etc.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    // Wichtig: Wenn das Handy/der Tab nach längerer Zeit
    // wieder aktiv wird, prüfen wir sofort, ob die Session
    // noch gültig ist bzw. erneuert werden muss.
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        supabase.auth.getSession().then(({ data, error }) => {
          if (error) {
            console.error("Fehler beim Re-Check der Session:", error.message);
            // API tot / Fehler beim Abrufen -> Seite neu laden
            window.location.reload();
            return;
          }

          // Optional: Wenn keine Session mehr vorhanden ist, obwohl vorher
          // eine da war (z.B. abgelaufen und Supabase konnte nicht refreshen)
          if (!data.session) {
            window.location.reload();
            return;
          }

          setSession(data.session);
        });
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
      <AuthContext.Provider value={{ session, loading }}>
        {children}
      </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}