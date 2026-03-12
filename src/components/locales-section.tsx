import { MapPin, Clock, ExternalLink } from "lucide-react"
import { STORE_ADDRESS, STORE_HOURS, STORE_MAPS_URL } from "@/lib/constants"

export function LocalesSection() {
  return (
    <section id="locales" className="py-24 bg-olive-dark">
      <div className="container">
        <div className="text-center mb-16">
          <span className="text-mustard font-medium text-sm uppercase tracking-widest">Visitanos</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mt-3 mb-4">
            Nuestros Locales
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Visitanos y probá la experiencia Guchini
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-border">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Store info */}
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-olive flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-foreground">
                      Guchini &ldquo;La Casa&rdquo;
                    </h3>
                    <p className="text-sm text-mustard font-semibold">Mendoza, Argentina</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <MapPin className="h-5 w-5 text-olive/60 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground text-sm">Dirección</p>
                      <p className="text-sm">{STORE_ADDRESS}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <Clock className="h-5 w-5 text-olive/60 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground text-sm">Horarios</p>
                      <p className="text-sm">{STORE_HOURS}</p>
                    </div>
                  </div>
                </div>

                <a
                  href={STORE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-olive hover:bg-olive-light text-white font-semibold px-6 py-3 rounded-full text-sm transition-colors w-fit"
                >
                  Cómo llegar
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              {/* Map embed */}
              <div className="min-h-[350px] lg:min-h-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3350.3!2d-68.8436!3d-32.8908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSan+Lorenzo+577%2C+Mendoza!5e0!3m2!1ses!2sar!4v1700000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "350px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación Guchini"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
