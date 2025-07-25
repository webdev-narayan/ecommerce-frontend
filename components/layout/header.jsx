
"use client"
import { Search, Menu, Phone, Mail, User, Heart, Facebook, Twitter, Instagram } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { CartSheet } from "../cart/cart-sheet"
import { redirect, usePathname } from "next/navigation"
import { noHeaderFooterRoutes } from "@/lib/constants"
import { useGlobal } from "@/contexts/global-context"
import { useState } from "react"

export function Header() {
  const path = usePathname()
  const { publicInfo, loading } = useGlobal()
  const [search, setSearch] = useState("")
  const hideHeaderFooter = noHeaderFooterRoutes.some((route) => path.startsWith(route))
  if (hideHeaderFooter) return null

  if (loading) return <header>
    <div className="w-full h-full flex items-center justify-center">
      <div className="spinner-border text-gray-400" role="status" />
    </div>
  </header>

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white py-2">
        <div className="container mx-auto px-4 justify-between items-center text-sm hidden md:flex">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              {publicInfo?.phone.includes("+91") ? publicInfo?.phone : "+91 " + publicInfo?.phone}
            </span>
            <span className="flex items-center">
              <Mail className="w-4 h-4 mr-1" />
              {publicInfo?.email}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <span>Free shipping on orders over ₹50</span>
              <Facebook className="w-4 h-4 cursor-pointer hover:text-gray-300" />
              <Twitter className="w-4 h-4 cursor-pointer hover:text-gray-300" />
              <Instagram className="w-4 h-4 cursor-pointer hover:text-gray-300" />
            </div>
          </div>
        </div>
        {/* mobile */}
        <p className="text-center md:hidden px-4 text-xs">Free shipping on orders over ₹500</p>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-2">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden shrink-0">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[320px]">
              <SheetTitle>
                <span className="font-medium">{publicInfo?.store_name || ""}</span>
              </SheetTitle>
              <MobileNavigation />
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <div className="flex items-center min-w-0">
            <Link href="/">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{publicInfo?.store_name || ""}</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link href="/shop" className="text-gray-700 hover:text-gray-900 font-medium whitespace-nowrap">
              Shop
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-gray-900 font-medium whitespace-nowrap">
              Categories
            </Link>
            <Link href="/brands" className="text-gray-700 hover:text-gray-900 font-medium whitespace-nowrap">
              Brands
            </Link>
            <Link href="/collections" className="text-gray-700 hover:text-gray-900 font-medium whitespace-nowrap">
              Collections
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <form onSubmit={(e) => {
            e.preventDefault()
            redirect(`/shop?search=${search}`)
          }} className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input onInput={(e) => setSearch(e.target.value)}
                type="search"
                placeholder="Search products..."
                className="pl-10 bg-gray-50 border-gray-200" />
            </div>
          </form>

          {/* Header Actions */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Mobile Search */}

            <Button onClick={() => redirect("/my-account")} variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button onClick={() => redirect("/wishlist")} variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <CartSheet />
          </div>
        </div>

        {/* Mobile Search Bar */}

        <form onSubmit={(e) => {
          e.preventDefault()
          redirect(`/shop?search=${search}`)
        }} className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              onInput={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              type="search"
              className="pl-10 bg-gray-50 border-gray-200 w-full" />
          </div>
        </form>
      </div>
    </header>
  )
}

function MobileNavigation() {
  return (
    <nav className="flex flex-col space-y-4 mt-8">
      <Link href="/shop" className="text-lg font-medium hover:text-gray-600">
        Shop
      </Link>
      <Link href="/categories" className="text-lg font-medium hover:text-gray-600">
        Categories
      </Link>
      <Link href="/brands" className="text-lg font-medium hover:text-gray-600">
        Brands
      </Link>
      <Link href="/collections" className="text-lg font-medium hover:text-gray-600">
        Collections
      </Link>
      <Link href="#" className="text-lg font-medium hover:text-gray-600">
        About
      </Link>
      <Link href="#" className="text-lg font-medium hover:text-gray-600">
        Contact
      </Link>
    </nav>
  )
}
