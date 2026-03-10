"use client"

import Link from "next/link"
import { ShoppingCart, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useCart } from "@/contexts/cart-context"
import { useEffect, useState } from "react"

interface UserData {
  sub: string
  email: string
  name: string | null
}

export function Navbar() {
  const { itemCount, setIsOpen } = useCart()
  const [user, setUser] = useState<UserData | null>(null)

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data))
      .catch(() => setUser(null))
  }, [])

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
    window.location.href = "/"
  }

  return (
    <nav className="sticky top-0 z-40 w-full bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/80 border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-display font-bold text-olive">
            Guchini
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
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
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-olive text-white text-xs">
                  {user.name?.[0] || user.email[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link href="/auth/login">
              <Button variant="outline" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Ingresar</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
