import { CheckCircle, ArrowRight } from "lucide-react"
import { STORE_FRANCHISE_FORM } from "@/lib/constants"

const BENEFITS = [
  {
    title: "Capacitación Integral",
    description: "Te acompañamos en cada paso del proceso, desde la apertura hasta la operación diaria.",
  },
  {
    title: "Exclusividad Territorial",
    description: "Zona exclusiva garantizada para maximizar tu potencial de mercado.",
  },
  {
    title: "Soporte Operativo",
    description: "Asistencia continua en operaciones, marketing y gestión del negocio.",
  },
  {
    title: "Presencia en Redes",
    description: "Estrategia de marketing digital y presencia activa en redes sociales.",
  },
]

export function FranquiciasSection() {
  return (
    <section id="franquicias" className="py-20 bg-olive text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 25px 25px, white 2px, transparent 0)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="container relative">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Franquicias
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Modelo de negocio simple, novedoso y rentable
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="flex gap-4 p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
            >
              <CheckCircle className="h-6 w-6 text-mustard flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-display font-bold mb-1">
                  {benefit.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href={STORE_FRANCHISE_FORM}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-mustard hover:bg-mustard-light text-foreground font-bold px-8 py-4 rounded-full text-lg transition-colors"
          >
            Quiero mi Franquicia
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  )
}
