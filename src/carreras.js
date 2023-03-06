import { COLORS } from "./theme";

export const CARRERAS = [
  {
    id: "sistemas",
    link: "https://www.fi.uba.ar/grado/carreras/lic-en-analisis-de-sistemas/plan-de-estudios",
    graph: require("./data/sistemas-2014.json"),
    nombre: "Licenciatura en Análisis de Sistemas",
    nombrecorto: "Sistemas",
    creditos: {
      total: 214,
      obligatorias: 136,
      electivas: 28,
      checkbox: [
        {
          nombre: "Prueba de nivel de idioma inglés",
          nombrecorto: "Inglés",
          bg: COLORS.enfinal[50],
          color: "enfinal",
        },
      ],
      materias: [
        {
          id: "95.61",
          nombrecorto: "TPP",
          bg: COLORS.findecarrera[50],
          color: "findecarrera",
        },
      ],
    },
  },
  {
    id: "ingles",
    link: "",
    graph: require("./data/sistemas-1986.json"),
    nombre: "Profesorado de Ingles",
    nombrecorto: "Ingles",
    creditos: {
      total: 214,
      obligatorias: 136,
      electivas: 28,
      checkbox: [
        {
          nombre: "Prueba de nivel de idioma inglés",
          nombrecorto: "Inglés",
          bg: COLORS.enfinal[50],
          color: "enfinal",
        },
      ],
      materias: [
        {
          id: "100",
          nombrecorto: "TPP",
          bg: COLORS.findecarrera[50],
          color: "findecarrera",
        },
      ],
    },
  },
];

export default CARRERAS;
