import { Instagram, MapPin, Mail } from "lucide-react"
import { STORE_NAME, STORE_TAGLINE, STORE_ADDRESS, STORE_INSTAGRAM, STORE_TIKTOK, STORE_EMAIL } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white/80 py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-3xl font-display font-bold text-white">{STORE_NAME}</h3>
            <p className="text-sm text-mustard font-medium mt-1">{STORE_TAGLINE}</p>
            <p className="text-sm text-white/50 mt-4 leading-relaxed max-w-xs">
              El perfecto equilibrio del Fast Food y lo Gourmet. Sándwiches artesanales en pan focaccia.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Navegación</h4>
            <div className="space-y-3 text-sm">
              {[
                { label: "Sanguchinis", href: "#productos" },
                { label: "Franquicias", href: "#franquicias" },
                { label: "Nosotros", href: "#historia" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-white/50 hover:text-mustard transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Contacto</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-white/50">
                <MapPin className="h-4 w-4 flex-shrink-0 text-white/30" />
                <span>{STORE_ADDRESS}</span>
              </div>
              <div className="flex items-center gap-3 text-white/50">
                <Mail className="h-4 w-4 flex-shrink-0 text-white/30" />
                <a href={`mailto:${STORE_EMAIL}`} className="hover:text-mustard transition-colors">
                  {STORE_EMAIL}
                </a>
              </div>
              <div className="flex items-center gap-3 text-white/50">
                <Instagram className="h-4 w-4 flex-shrink-0 text-white/30" />
                <a
                  href="https://www.instagram.com/guchini.ar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-mustard transition-colors"
                >
                  {STORE_INSTAGRAM}
                </a>
              </div>
              <div className="flex items-center gap-3 text-white/50">
                <svg className="h-4 w-4 flex-shrink-0 text-white/30" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52V6.8a4.83 4.83 0 01-1-.11z"/>
                </svg>
                <a
                  href="https://www.tiktok.com/@guchini.ar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-mustard transition-colors"
                >
                  {STORE_TIKTOK}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-xs text-white/30">
          &copy; {new Date().getFullYear()} {STORE_NAME}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
