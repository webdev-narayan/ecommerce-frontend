import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/lib/cart-context"
import { Toaster } from "sonner"
// import Header from './../layout/Header';

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "StyleStore - Your Fashion Destination",
  description: "Discover the latest trends in fashion and style",
  generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          {/* <Header /> */}
          {children}
          <Toaster position="bottom-right" richColors />
        </CartProvider>
      </body>
    </html>
  )
}
