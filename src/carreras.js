import { COLORS } from "./theme";

export const CARRERAS = [{
    id: "ingles",
    link: "",
    graph: require("./data/sistemas-1986.json"),
    nombre: "Profesorado de Ingles",
    nombrecorto: "Ingles",
    creditos: {
        total: 46,
        obligatorias: 42,
        formativoI: 1,
        formativoII: 1,
        didacticaEspecifica: 1,
        electivas: 4,
        checkbox: [],
        materias: [{
            id: "100",
            nombrecorto: "TPP",
            bg: COLORS.findecarrera[50],
            color: "findecarrera",
        }, ],
    },
}, ];

export default CARRERAS;