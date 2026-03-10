import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "Guchini — Un Manso Sanguche",
  description: "Pedí online tu sándwich artesanal en pan focaccia y retiralo en el local. Street food premium en Mendoza.",
  openGraph: {
    title: "Guchini — Un Manso Sanguche",
    description: "Sándwiches artesanales en pan focaccia. Pedí online, pasá a buscar.",
    siteName: "Guchini",
    locale: "es_AR",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2D5016" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-body antialiased`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
