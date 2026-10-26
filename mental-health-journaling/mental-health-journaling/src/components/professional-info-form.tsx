import { useEffect, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

import { Dropdown } from "@/components/dropdown";
import { appStyles } from "@/constants/app-styles";
import { REGIONES, comunasDe } from "@/constants/regiones";
import { useTheme } from "@/hooks/use-theme";
import {
  GENEROS,
  actualizarMisDatos,
  calcularEdad,
  fechaATexto,
  formatearFechaEscrita,
  obtenerMisDatos,
  textoAFecha,
  type DatosProfesional,
} from "@/lib/profesionales";

const s = appStyles.datosPersonales;

type Props = {
  userId: string;
};

/** Fecha de nacimiento (edad), género, región y comuna del profesional. Se usa en personal-data.tsx. */
export function ProfessionalInfoForm({ userId }: Props) {
  const c = useTheme();

  const [guardados, setGuardados] = useState<DatosProfesional | null>(null);
  const [fechaTexto, setFechaTexto] = useState("");
  const [genero, setGenero] = useState<string | null>(null);
  const [region, setRegion] = useState<string | null>(null);
  const [comuna, setComuna] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    obtenerMisDatos(userId)
      .then((datos) => {
        setGuardados(datos);
        setFechaTexto(fechaATexto(datos.fecha_nacimiento));
        setGenero(datos.genero);
        setRegion(datos.region);
        setComuna(datos.comuna);
      })
      .catch((e) => console.log("Error al cargar los datos del profesional:", e.message));
  }, [userId]);

  const fecha = textoAFecha(fechaTexto);
  const fechaIncompleta = fechaTexto.length > 0 && fechaTexto.length < 10;
  const fechaInvalida = fechaTexto.length === 10 && !fecha;

  const hayCambios =
    !!guardados &&
    ((fecha ?? null) !== guardados.fecha_nacimiento ||
      genero !== guardados.genero ||
      region !== guardados.region ||
      comuna !== guardados.comuna);

  // La comuna depende de la región, así que se limpia al cambiarla
  const cambiarRegion = (nueva: string | null) => {
    setRegion(nueva);
    setComuna(null);
  };

  const guardar = async () => {
    if (fechaIncompleta || fechaInvalida) {
      Alert.alert("Fecha no válida", "Escribe tu fecha de nacimiento como DD/MM/AAAA.");
      return;
    }
    if (region && !comuna) {
      Alert.alert("Falta la comuna", "Elige la comuna de tu región.");
      return;
    }

    const datos = { fecha_nacimiento: fecha, genero, region, comuna };
    setGuardando(true);
    try {
      await actualizarMisDatos(userId, datos);
      setGuardados(datos);
      Alert.alert("Datos actualizados", "Tu información se guardó correctamente.");
    } catch (e) {
      Alert.alert("No se pudo guardar", (e as Error).message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <View style={s.section}>
      <View style={s.field}>
        <Text style={[s.label, { color: c.text }]}>Fecha de nacimiento</Text>
        <TextInput
          style={[s.input, { color: c.text, borderColor: fechaInvalida ? c.error : c.border }]}
          value={fechaTexto}
          onChangeText={(texto) => setFechaTexto(formatearFechaEscrita(texto))}
          placeholder="DD/MM/AAAA"
          placeholderTextColor={c.textSecondary}
          keyboardType="number-pad"
          maxLength={10}
        />
        <Text style={[s.hint, { color: fechaInvalida ? c.error : c.textSecondary }]}>
          {fechaInvalida
            ? "La fecha no es válida."
            : fecha
              ? `Edad: ${calcularEdad(fecha)} años`
              : "Se usa para calcular tu edad."}
        </Text>
      </View>

      <Dropdown
        label="Género"
        placeholder="Selecciona tu género"
        options={GENEROS}
        value={genero}
        onChange={setGenero}
      />

      <Dropdown
        label="Región"
        placeholder="Selecciona tu región"
        options={REGIONES}
        value={region}
        onChange={cambiarRegion}
      />

      <Dropdown
        label="Comuna"
        placeholder={region ? "Selecciona tu comuna" : "Primero elige una región"}
        options={comunasDe(region)}
        value={comuna}
        onChange={setComuna}
        disabled={!region}
      />

      <Pressable
        style={[
          s.button,
          { backgroundColor: c.accent },
          (!hayCambios || guardando) && s.buttonDisabled,
        ]}
        onPress={guardar}
        disabled={!hayCambios || guardando}
        accessibilityRole="button"
      >
        <Text style={[s.buttonText, { color: c.accentText }]}>
          {guardando ? "Guardando..." : "Guardar información"}
        </Text>
      </Pressable>
    </View>
  );
}
