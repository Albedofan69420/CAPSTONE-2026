import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";
import { hasPin as readHasPin } from "@/lib/pin";

type AuthData = {
  loading: boolean;
  session: Session | null;
  /** null mientras se comprueba si este teléfono ya tiene un PIN para el usuario */
  hasPin: boolean | null;
  /** true al abrir la app con una sesión y un PIN guardado: hay que pedir el PIN */
  locked: boolean;
  unlock: () => void;
  pinCreated: () => void;
};

const AuthContext = createContext<AuthData>({
  loading: true,
  session: null,
  hasPin: null,
  locked: false,
  unlock: () => {},
  pinCreated: () => {},
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [hasPin, setHasPin] = useState<boolean | null>(null);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    async function init() {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.log("Error al obtener la sesión:", error.message);

      const current = data.session;

      if (current) {
        // Solo al abrir la app: si ya existe un PIN, se bloquea hasta ingresarlo
        const pin = await readHasPin(current.user.id);
        setHasPin(pin);
        setLocked(pin);
      }

      setSession(current);
      setLoading(false);
    }

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (event === "SIGNED_OUT") {
        setSession(null);
        setHasPin(null);
        setLocked(false);
        return;
      }

      setSession(newSession);

      // Inicio de sesión con contraseña: no se pide PIN, solo se revisa si falta crearlo
      if (event === "SIGNED_IN" && newSession) {
        readHasPin(newSession.user.id).then(setHasPin);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loading,
        session,
        hasPin,
        locked,
        unlock: () => setLocked(false),
        pinCreated: () => {
          setHasPin(true);
          setLocked(false);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);