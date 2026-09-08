// Configuración del vertical CM Smart Help.
// Para activar un nuevo desafío (ej. CM Smart Savings), se crea un archivo
// hermano a este con su propio slug, categorías y campos — no se toca el core.

export const CM_SMART_HELP = {
  vertical: "cm_smart_help",
  label: "CM Smart Help",
  description: "Especialistas en reparaciones del hogar ↔ usuarios con necesidades",

  // Campos custom del Request (la necesidad del usuario)
  requestFields: [
    { key: "urgencia", label: "Urgencia", type: "select", options: ["baja", "media", "alta"] },
    { key: "ciudad", label: "Ciudad", type: "fixed", default: "Lima" },
    { key: "distrito", label: "Distrito", type: "select" }, // opciones: ver config/lima-districts.ts
  ],

  // Campos custom del Listing (perfil del especialista)
  listingFields: [
    { key: "zona_cobertura", label: "Distritos de cobertura", type: "multi-select" }, // opciones: ver config/lima-districts.ts
    { key: "certificaciones", label: "Certificaciones / documentos", type: "text" }, // texto por ahora, fotos pendiente
    { key: "portafolio", label: "Portafolio de trabajos anteriores", type: "text" }, // texto por ahora, fotos pendiente
  ],
} as const;
