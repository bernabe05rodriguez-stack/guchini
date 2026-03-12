export const STORE_NAME = "Guchini"
export const STORE_TAGLINE = "Un Manso Sanguche"
export const STORE_ADDRESS = "San Lorenzo 577, M5502 Mendoza"
export const STORE_INSTAGRAM = "@guchini.ar"
export const STORE_TIKTOK = "@guchini.ar"
export const STORE_EMAIL = "guchini.ar@gmail.com"
export const STORE_HOURS = "Lun-Sáb 8:00-23:00"

// Horario del local: Lunes(1) a Sábado(6), 8:00 a 23:00 (hora Argentina UTC-3)
export function getStoreStatus(): { isOpen: boolean; message: string } {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Mendoza" }))
  const day = now.getDay() // 0=Dom, 1=Lun, ..., 6=Sáb
  const hour = now.getHours()
  const minutes = now.getMinutes()
  const currentMinutes = hour * 60 + minutes

  const OPEN = 8 * 60   // 8:00
  const CLOSE = 23 * 60 // 23:00

  // Domingo (0) = cerrado
  if (day === 0) {
    return { isOpen: false, message: "Abrimos mañana lunes a las 8:00" }
  }

  // Lunes a Sábado
  if (currentMinutes >= OPEN && currentMinutes < CLOSE) {
    return { isOpen: true, message: "" }
  }

  // Cerrado pero día hábil
  if (currentMinutes < OPEN) {
    const hoursLeft = Math.floor((OPEN - currentMinutes) / 60)
    const minsLeft = (OPEN - currentMinutes) % 60
    if (hoursLeft > 0) {
      return { isOpen: false, message: `Abrimos hoy a las 8:00 (en ${hoursLeft}h ${minsLeft > 0 ? minsLeft + "min" : ""})` }
    }
    return { isOpen: false, message: `Abrimos en ${minsLeft} minutos` }
  }

  // Después de las 23:00
  if (day === 6) {
    // Sábado de noche → abre lunes
    return { isOpen: false, message: "Abrimos el lunes a las 8:00" }
  }
  return { isOpen: false, message: "Abrimos mañana a las 8:00" }
}
export const STORE_MAPS_URL = "https://www.google.com/maps/place/San+Lorenzo+577,+M5502+Mendoza"
export const STORE_FRANCHISE_FORM = "https://docs.google.com/forms/d/e/1FAIpQLSc_guchini_franquicias/viewform"
export const ORDER_PREFIX = "GUCH"

export const CATALOG_PRODUCTS = [
  {
    name: "Crudo",
    description: "Jamón crudo, queso sardo, tomate, rúcula, pesto de albahaca",
    bread: "Focaccia",
    image: "/products/crudo.jpg",
  },
  {
    name: "La Patrona",
    description: "Milanesa de berenjena, queso sardo, cebolla pickle, tomate, rúcula, alioli",
    bread: "Focaccia",
    image: "/products/la_patrona.jpg",
  },
  {
    name: "Guchicken",
    description: "Milanesa de pollo, queso gruyere, coleslaw, mostaneza",
    bread: "Focaccia",
    image: "/products/guchicken.jpg",
  },
  {
    name: "Mortadela",
    description: "Mortadela con pistacho, stracciatella, queso sbrinz, pesto",
    bread: "Focaccia",
    image: "/products/mortadela.jpg",
  },
]

export const TIMELINE_EVENTS = [
  {
    month: "Enero 2024",
    title: "El Comienzo",
    description: "Cuatro emprendedores con una visión compartida dan vida a Guchini.",
  },
  {
    month: "Abril 2024",
    title: "Conceptualización",
    description: "Definimos nuestro producto: el perfecto equilibrio entre fast food y gourmet.",
  },
  {
    month: "Mayo 2024",
    title: "Investigación Gastronómica",
    description: "Viaje de investigación para perfeccionar recetas e ingredientes.",
  },
  {
    month: "Octubre 2024",
    title: "Estrategia de Marketing",
    description: "Desarrollamos una estrategia de marketing innovadora para el lanzamiento.",
  },
  {
    month: "Noviembre 2024",
    title: "Gran Apertura",
    description: "Abrimos nuestras puertas con 1.200 visitantes el primer día.",
  },
]
