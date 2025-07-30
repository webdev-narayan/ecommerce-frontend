import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/lib/cart-context"
import { Toaster } from "sonner"
import { Header } from './../components/layout/header';
import { Footer } from './../components/layout/footer';
import { AuthProvider } from "@/contexts/auth-context";
import InstallPwaPrompt from "@/components/install-pwa";
import { GlobalProvider } from "@/contexts/global-context";
import NProgressProvider from "@/components/nprogress";

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "StyleStore - Your Fashion Destination",
  description: "Discover the latest trends in fashion and style",
  generator: 'v0.dev',
  manifest: "/manifest.json",
}

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <InstallPwaPrompt />
        {/* <NProgressProvider /> */}
        <AuthProvider>
          <GlobalProvider>
            <CartProvider>
              <Header />
              {children}
              <Footer />
              <Toaster position="bottom-right" richColors />
            </CartProvider>
          </GlobalProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
