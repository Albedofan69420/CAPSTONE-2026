export type Profesional = {
  id: string;
  nombre: string;
  profesion: string;
  foto: string;
  /** De 0 a 5 */
  calificacion: number;
  descripcion: string;
};

// Datos provisorios, reemplazar por los obtenidos desde el backend.
export const PROFESIONALES: Profesional[] = [
  {
    id: "1",
    nombre: "Camila Rojas",
    profesion: "Psicóloga clínica",
    foto: "https://i.pravatar.cc/150?img=47",
    calificacion: 5,
    descripcion:
      "Psicóloga clínica con más de 8 años de experiencia acompañando a adultos y adolescentes en procesos de ansiedad, estrés y manejo de emociones. Trabajo desde un enfoque cognitivo-conductual, en un espacio cercano y libre de juicios, para que puedas comprender lo que sientes y construir herramientas para tu día a día.",
  },
];

export const obtenerProfesional = (id: string) => PROFESIONALES.find((p) => p.id === id);
