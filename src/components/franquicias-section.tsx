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
    <section id="franquicias" className="py-14 md:py-24 bg-olive text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 25px 25px, white 2px, transparent 0)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="container relative">
        <div className="text-center mb-10 md:mb-16">
          <span className="text-mustard font-medium text-sm uppercase tracking-widest">Crecé con nosotros</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mt-3 mb-3 md:mb-4">
            Franquicias
          </h2>
          <p className="text-base md:text-xl text-white/70 max-w-3xl mx-auto">
            Modelo de negocio simple, novedoso y rentable
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 max-w-4xl mx-auto mb-10 md:mb-14">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="flex gap-3 md:gap-4 p-4 md:p-6 rounded-xl md:rounded-2xl bg-white/[0.06] backdrop-blur-sm border border-white/10 hover:bg-white/[0.1] transition-all duration-300"
            >
              <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-mustard flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base md:text-lg font-display font-bold mb-1">
                  {benefit.title}
                </h3>
                <p className="text-white/60 text-xs md:text-sm leading-relaxed">
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
            className="inline-flex items-center gap-2 bg-mustard hover:bg-mustard-light text-foreground font-bold px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg transition-all hover:shadow-lg hover:shadow-mustard/20"
          >
            Quiero mi Franquicia
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  )
}
