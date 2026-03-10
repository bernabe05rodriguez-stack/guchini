import { MapPin, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { STORE_ADDRESS } from "@/lib/constants"

interface HeroSectionProps {
  storeOpen: boolean
  storeMessage: string
}

export function HeroSection({ storeOpen, storeMessage }: HeroSectionProps) {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-olive">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-olive/70" />

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 25px 25px, white 2px, transparent 0)",
          backgroundSize: "50px 50px",
        }} />
      </div>

      <div className="container relative text-center py-32">
        <Badge
          className={`mb-6 text-sm px-4 py-2 ${
            storeOpen
              ? "bg-green-500/20 text-green-100 border-green-500/30"
              : "bg-red-500/20 text-red-100 border-red-500/30"
          }`}
        >
          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${storeOpen ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
          {storeOpen ? "Local abierto" : "Local cerrado"}
        </Badge>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-6 leading-tight">
          Un Manso<br />Sanguche
        </h1>

        <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
          El perfecto equilibrio del Fast Food y lo Gourmet, todo en un Guchini
        </p>

        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-1.5 text-white/70 text-sm">
            <MapPin className="h-4 w-4" />
            <span>{STORE_ADDRESS}</span>
          </div>

          {storeMessage && (
            <p className="text-white/60 text-sm mt-1">{storeMessage}</p>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white/40" />
        </div>
      </div>
    </section>
  )
}
