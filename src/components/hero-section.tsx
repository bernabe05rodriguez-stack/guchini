import { MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { STORE_ADDRESS } from "@/lib/constants"

interface HeroSectionProps {
  storeOpen: boolean
  storeMessage: string
}

export function HeroSection({ storeOpen, storeMessage }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-olive py-16 md:py-24">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 25px 25px, white 2px, transparent 0)",
          backgroundSize: "50px 50px",
        }} />
      </div>

      <div className="container relative text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-4">
          Un Manso Sanguche 🥪
        </h1>
        <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
          Pedí online, pasá a buscar. Nada más simple.
        </p>

        <div className="flex flex-col items-center gap-3">
          <Badge
            className={`text-sm px-4 py-2 ${
              storeOpen
                ? "bg-green-500/20 text-green-100 border-green-500/30"
                : "bg-red-500/20 text-red-100 border-red-500/30"
            }`}
          >
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${storeOpen ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
            {storeOpen ? "Local abierto" : "Local cerrado"}
          </Badge>

          <div className="flex items-center gap-1.5 text-white/70 text-sm">
            <MapPin className="h-4 w-4" />
            <span>{STORE_ADDRESS}</span>
          </div>

          {storeMessage && (
            <p className="text-white/60 text-sm mt-2">{storeMessage}</p>
          )}
        </div>
      </div>
    </section>
  )
}
