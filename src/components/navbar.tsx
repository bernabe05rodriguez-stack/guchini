"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, User, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useCart } from "@/contexts/cart-context"
import { useEffect, useState } from "react"

interface UserData {
  sub: string
  email: string
  name: string | null
}

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Sanguchinis", href: "#productos" },
  { label: "Franquicias", href: "#franquicias" },
  { label: "Nosotros", href: "#historia" },
]

export function Navbar() {
  const { itemCount, setIsOpen } = useCart()
  const [user, setUser] = useState<UserData | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user) {
          setUser({ sub: data.user.id, email: data.user.email, name: data.user.fullName })
        } else {
          setUser(null)
        }
      })
      .catch(() => setUser(null))
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
    window.location.href = "/"
  }

  const handleNavClick = (href: string) => {
    setMobileOpen(false)
    if (href.startsWith("#")) {
      const el = document.querySelector(href)
      if (el) {
        el.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <nav className={`fixed top-0 z-50 w-full transition-all duration-500 ${
      scrolled
        ? "bg-white/95 backdrop-blur-md shadow-sm"
        : "bg-transparent"
    }`}>
      <div className="container flex items-center justify-between py-2 md:py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center" onClick={() => handleNavClick("#home")}>
          <Image src="/logo.png" alt="Guchini" width={72} height={72} className="rounded-full md:w-[112px] md:h-[112px]" />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className={`text-sm font-medium transition-colors duration-300 hover:text-mustard ${
                scrolled ? "text-foreground/70" : "text-white/80"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            className={`relative ${scrolled ? "hover:bg-olive/5" : "text-white hover:bg-white/10"}`}
            onClick={() => setIsOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-mustard text-xs font-bold flex items-center justify-center text-foreground">
                {itemCount}
              </span>
            )}
          </Button>

          {/* User */}
          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-olive text-white text-xs">
                  {user.name?.[0] || user.email[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon" onClick={handleSignOut} className={scrolled ? "hover:bg-olive/5" : "text-white hover:bg-white/10"}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link href="/auth/login" className="hidden sm:block">
              <Button
                size="sm"
                className="gap-2 rounded-full font-semibold"
                style={scrolled
                  ? { backgroundColor: "#2D5016", color: "#FFFFFF" }
                  : { backgroundColor: "rgba(255,255,255,0.2)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.4)", backdropFilter: "blur(8px)" }
                }
              >
                <User className="h-4 w-4" />
                Ingresar
              </Button>
            </Link>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className={`md:hidden ${scrolled ? "" : "text-white hover:bg-white/10"}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-border/50 shadow-lg">
          <div className="container py-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="block w-full text-left text-foreground/70 hover:text-olive hover:bg-olive/5 font-medium py-2.5 px-3 text-sm rounded-lg transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 border-t border-border/50 mt-2">
              {!user && (
                <Link href="/auth/login" className="block">
                  <Button variant="outline" size="sm" className="w-full gap-2 rounded-full">
                    <User className="h-4 w-4" />
                    Ingresar
                  </Button>
                </Link>
              )}
              {user && (
                <Button variant="ghost" size="sm" className="w-full gap-2" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
