import { TIMELINE_EVENTS } from "@/lib/constants"

export function HistoriaSection() {
  return (
    <section id="historia" className="py-14 md:py-24 bg-cream">
      <div className="container">
        <div className="text-center mb-10 md:mb-16">
          <span className="text-mustard font-medium text-sm uppercase tracking-widest">Sobre nosotros</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mt-3 mb-3 md:mb-4">
            Nuestra Historia
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            El camino que nos trajo hasta acá
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-olive/15 -translate-x-1/2" />

          <div className="space-y-8 md:space-y-14">
            {TIMELINE_EVENTS.map((event, index) => (
              <div
                key={event.month}
                className={`relative flex flex-col md:flex-row items-start gap-4 md:gap-6 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 w-3 h-3 md:w-4 md:h-4 bg-olive rounded-full border-[3px] md:border-4 border-cream md:border-white shadow-md -translate-x-1/2 z-10" />

                {/* Content */}
                <div
                  className={`ml-10 md:ml-0 md:w-[calc(50%-2rem)] ${
                    index % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"
                  }`}
                >
                  <span className="text-xs md:text-sm font-bold text-mustard uppercase tracking-wider">
                    {event.month}
                  </span>
                  <h3 className="text-lg md:text-xl font-display font-bold text-foreground mt-1 mb-1 md:mb-2">
                    {event.title}
                  </h3>
                  <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {/* Spacer for opposite side */}
                <div className="hidden md:block md:w-[calc(50%-2rem)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
