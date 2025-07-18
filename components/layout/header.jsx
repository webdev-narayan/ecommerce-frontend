"use client"

import { useState } from "react"
import { Search, Menu, Phone, Mail, Facebook, Twitter, Instagram, User, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CartSheet } from "../cart-sheet"
import { redirect, usePathname } from "next/navigation"
import { noHeaderFooterRoutes } from "@/lib/constants"

export function Header() {

  const path = usePathname()

  const hideHeaderFooter = noHeaderFooterRoutes.some((route) => path.startsWith(route))
  if (hideHeaderFooter) return null

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white py-2">
        <div className="container mx-auto px-4 justify-between items-center text-sm hidden md:flex">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              +1 (555) 123-4567
            </span>
            <span className="flex items-center">
              <Mail className="w-4 h-4 mr-1" />
              support@store.com
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <span>Free shipping on orders over $50</span>
              <Facebook className="w-4 h-4 cursor-pointer hover:text-gray-300" />
              <Twitter className="w-4 h-4 cursor-pointer hover:text-gray-300" />
              <Instagram className="w-4 h-4 cursor-pointer hover:text-gray-300" />
            </div>
          </div>
        </div>
        {/* mobile */}
        <p className="text-center md:hidden">Free shipping on orders over ₹500</p>

      </div>

      {/* Main Header */}
      <div className="container mx-auto px-2 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <MobileNavigation />
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold text-gray-900">StyleStore</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center lg:space-x-8 space-x-3 ml-4 xl:ml-0">
            <Link href="/shop" className="text-gray-700 hover:text-gray-900 font-medium">
              Shop
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-gray-900 font-medium">
              Categories
            </Link>
            <Link href="/brands" className="text-gray-700 hover:text-gray-900 font-medium">
              Brands
            </Link>
            <Link href="/collections" className="text-gray-700 hover:text-gray-900 font-medium">
              Collections
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search products..." className="pl-10 bg-gray-50 border-gray-200" />
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center md:space-x-2">
            <Button className="" variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button className="" onClick={() => redirect("/wishlist")} variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <CartSheet />
          </div>
        </div>
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