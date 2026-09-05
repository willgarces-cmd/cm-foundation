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
    { key: "presupuesto", label: "Rango de presupuesto (S/)", type: "text" },
    { key: "ubicacion", label: "Ubicación (comuna/zona)", type: "text" },
    { key: "fotos", label: "Fotos del problema", type: "photos" },
  ],

  // Campos custom del Listing (perfil del especialista)
  listingFields: [
    { key: "zona_cobertura", label: "Zona de cobertura", type: "text" },
    { key: "certificaciones", label: "Certificaciones / documentos", type: "photos" },
    { key: "portafolio", label: "Portafolio de trabajos anteriores", type: "photos" },
  ],
} as const;
