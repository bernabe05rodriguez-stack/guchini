import { Instagram, MapPin } from "lucide-react"
import { STORE_NAME, STORE_TAGLINE, STORE_ADDRESS, STORE_INSTAGRAM } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="bg-foreground text-white/80 py-10">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-display font-bold text-white">{STORE_NAME}</h3>
            <p className="text-sm text-white/60 mt-1">{STORE_TAGLINE}</p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2 text-sm">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>{STORE_ADDRESS}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Instagram className="h-4 w-4" />
              <span>{STORE_INSTAGRAM}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-white/40">
          © {new Date().getFullYear()} {STORE_NAME}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
