import { MapPin, Clock, ExternalLink } from "lucide-react"
import { STORE_ADDRESS, STORE_HOURS, STORE_MAPS_URL } from "@/lib/constants"

export function LocalesSection() {
  return (
    <section id="locales" className="py-20 bg-cream">
      <div className="container">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Nuestros Locales
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Visitanos y probá la experiencia Guchini
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Store card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-olive/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-olive" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-foreground">
                    Guchini La Casa
                  </h3>
                  <p className="text-sm text-mustard font-medium">Mendoza</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-olive/60" />
                  <span>{STORE_ADDRESS}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-olive/60" />
                  <span>{STORE_HOURS}</span>
                </div>
              </div>

              <a
                href={STORE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 text-olive hover:text-olive-light font-medium text-sm transition-colors"
              >
                Ver en Google Maps
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {/* Map embed */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm min-h-[280px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3350.3!2d-68.8436!3d-32.8908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSan+Lorenzo+577%2C+Mendoza!5e0!3m2!1ses!2sar!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "280px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Guchini"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
