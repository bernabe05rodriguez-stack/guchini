import { CartProvider } from "@/contexts/cart-context"
import { Navbar } from "@/components/navbar"
import { CartSheet } from "@/components/cart-sheet"
import { Footer } from "@/components/footer"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartSheet />
      </div>
    </CartProvider>
  )
}
