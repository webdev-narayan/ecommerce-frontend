import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/lib/cart-context"
import { Toaster } from "sonner"
import { Header } from './../components/layout/header';
import { Footer } from './../components/layout/footer';
import { AuthProvider } from "@/contexts/auth-context";
import Head from "next/head";
import InstallPwaPrompt from "@/components/install-pwa";

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "StyleStore - Your Fashion Destination",
  description: "Discover the latest trends in fashion and style",
  generator: 'v0.dev'
}

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body className={inter.className}>
        <InstallPwaPrompt />
        <AuthProvider>
          <CartProvider>
            <Header />
            {children}
            <Footer />
            <Toaster position="bottom-right" richColors />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
