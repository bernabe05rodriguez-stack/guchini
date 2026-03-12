"use client"

import { MapPin, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { STORE_ADDRESS } from "@/lib/constants"

interface HeroSectionProps {
  storeOpen: boolean
  storeMessage: string
}

export function HeroSection({ storeOpen, storeMessage }: HeroSectionProps) {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-olive">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      />

      {/* Dark overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-olive/80 via-olive/60 to-olive/80" />

      <div className="container relative text-center py-32">
        <Badge
          className={`mb-8 text-sm px-5 py-2.5 rounded-full backdrop-blur-sm ${
            storeOpen
              ? "bg-green-500/20 text-green-100 border-green-500/30"
              : "bg-red-500/20 text-red-100 border-red-500/30"
          }`}
        >
          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${storeOpen ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
          {storeOpen ? "Local abierto" : "Local cerrado"}
        </Badge>

        <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-white mb-6 leading-[0.9] tracking-tight">
          Un Manso<br />Sanguche
        </h1>

        <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          El perfecto equilibrio del Fast Food y lo Gourmet, todo en un Guchini
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Button
            onClick={() => scrollTo("#productos")}
            className="bg-mustard hover:bg-mustard-light text-foreground font-bold px-8 py-6 text-base rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Nuestros Sanguchinis
          </Button>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1.5 text-white/60 text-sm">
            <MapPin className="h-4 w-4" />
            <span>{STORE_ADDRESS}</span>
          </div>

          {storeMessage && (
            <p className="text-white/50 text-sm">{storeMessage}</p>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white/30" />
        </div>
      </div>
    </section>
  )
}
