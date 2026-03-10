import { TIMELINE_EVENTS } from "@/lib/constants"

export function HistoriaSection() {
  return (
    <section id="historia" className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Nuestra Historia
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            El camino que nos trajo hasta acá
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-olive/20 -translate-x-1/2" />

          <div className="space-y-12">
            {TIMELINE_EVENTS.map((event, index) => (
              <div
                key={event.month}
                className={`relative flex flex-col md:flex-row items-start gap-6 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Dot */}
                <div className="absolute left-6 md:left-1/2 w-4 h-4 bg-olive rounded-full border-4 border-white shadow -translate-x-1/2 z-10" />

                {/* Content */}
                <div
                  className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${
                    index % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"
                  }`}
                >
                  <span className="text-sm font-bold text-mustard uppercase tracking-wider">
                    {event.month}
                  </span>
                  <h3 className="text-xl font-display font-bold text-foreground mt-1 mb-2">
                    {event.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
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
