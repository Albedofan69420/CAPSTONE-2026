import { createContext, useContext, useEffect, useState } from "react";
import { AppState } from "react-native";

import { escucharMisCitas, obtenerResumenCitas } from "@/lib/citas";
import { useAuth } from "@/providers/AuthProvider";

type CitasData = {
  /** Cantidad de citas del usuario (de cualquier estado): con 0 se oculta la pestaña Citas */
  totalCitas: number;
  /** Número del círculo rojo del menú inferior */
  noLeidos: number;
  /** Aumenta con cada cambio en las citas: las listas lo usan para recargarse */
  version: number;
};

const CitasContext = createContext<CitasData>({ totalCitas: 0, noLeidos: 0, version: 0 });

// Resumen de las citas en vivo, compartido por el menú inferior y las listas de citas
export default function CitasProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const userId = session?.user.id;
  const [totalCitas, setTotalCitas] = useState(0);
  const [noLeidos, setNoLeidos] = useState(0);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const recargar = () => {
      obtenerResumenCitas()
        .then((resumen) => {
          setTotalCitas(resumen.total_citas);
          setNoLeidos(resumen.no_leidos);
        })
        .catch((e) => console.log("Error al cargar el resumen de citas:", e.message))
        .finally(() => setVersion((v) => v + 1));
    };

    recargar();
    const dejarDeEscuchar = escucharMisCitas(recargar);

    // Con la app en segundo plano se pueden perder avisos de Realtime: se recarga al volver
    const appState = AppState.addEventListener("change", (estado) => {
      if (estado === "active") recargar();
    });

    return () => {
      dejarDeEscuchar();
      appState.remove();
    };
  }, [userId]);

  // Sin sesión no se muestran datos de la cuenta anterior
  const value = userId ? { totalCitas, noLeidos, version } : { totalCitas: 0, noLeidos: 0, version };

  return <CitasContext.Provider value={value}>{children}</CitasContext.Provider>;
}

export const useCitas = () => useContext(CitasContext);
