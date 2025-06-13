"use client"

import { useEffect } from "react"
import {
  Search,
  User,
  Heart,
  Menu,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MapPin,
  ArrowRight,
  Star,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/lib/cart-context"
import { CartSheet } from "@/components/cart-sheet"

export default function BrandsPage() {
  const { getTotalItems } = useCart()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const brands = [
    {
      name: "Nike",
      logo: "Nike logo",
      description: "Just Do It. Leading athletic wear and footwear brand.",
      products: 45,
      rating: 4.8,
      established: "1964",
      category: "Athletic Wear",
    },
    {
      name: "Adidas",
      logo: "Adidas logo",
      description: "Impossible is Nothing. Premium sports and lifestyle brand.",
      products: 38,
      rating: 4.7,
      established: "1949",
      category: "Athletic Wear",
    },
    {
      name: "Zara",
      logo: "Zara logo",
      description: "Fast fashion retailer with trendy and affordable clothing.",
      products: 67,
      rating: 4.5,
      established: "1975",
      category: "Fashion",
    },
    {
      name: "H&M",
      logo: "H&M logo",
      description: "Conscious fashion for everyone. Sustainable and stylish.",
      products: 89,
      rating: 4.3,
      established: "1947",
      category: "Fashion",
    },
    {
      name: "Uniqlo",
      logo: "Uniqlo logo",
      description: "LifeWear for everyone. Simple, high-quality basics.",
      products: 34,
      rating: 4.6,
      established: "1949",
      category: "Casual Wear",
    },
    {
      name: "Levi's",
      logo: "Levi's logo",
      description: "The original jeans company since 1853.",
      products: 28,
      rating: 4.7,
      established: "1853",
      category: "Denim",
    },
    {
      name: "Coach",
      logo: "Coach logo",
      description: "Luxury leather goods and accessories.",
      products: 23,
      rating: 4.9,
      established: "1941",
      category: "Luxury",
    },
    {
      name: "Ray-Ban",
      logo: "Ray-Ban logo",
      description: "Iconic sunglasses and eyewear since 1937.",
      products: 19,
      rating: 4.8,
      established: "1937",
      category: "Eyewear",
    },
    {
      name: "Apple",
      logo: "Apple logo",
      description: "Think Different. Premium technology and accessories.",
      products: 12,
      rating: 4.9,
      established: "1976",
      category: "Technology",
    },
    {
      name: "Lululemon",
      logo: "Lululemon logo",
      description: "Technical athletic apparel for yoga and running.",
      products: 31,
      rating: 4.6,
      established: "1998",
      category: "Athletic Wear",
    },
    {
      name: "Hermès",
      logo: "Hermès logo",
      description: "French luxury goods manufacturer specializing in leather.",
      products: 15,
      rating: 4.9,
      established: "1837",
      category: "Luxury",
    },
    {
      name: "Puma",
      logo: "Puma logo",
      description: "Forever Faster. Sports lifestyle brand.",
      products: 29,
      rating: 4.5,
      established: "1948",
      category: "Athletic Wear",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        {/* Top Bar */}
        <div className="bg-gray-900 text-white py-2">
          <div className="container mx-auto px-4 flex justify-between items-center text-sm">
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
              <span>Free shipping on orders over $50</span>
              <div className="flex space-x-2">
                <Facebook className="w-4 h-4 cursor-pointer hover:text-gray-300" />
                <Twitter className="w-4 h-4 cursor-pointer hover:text-gray-300" />
                <Instagram className="w-4 h-4 cursor-pointer hover:text-gray-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
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
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <div className="flex items-center">
              <Link href="/">
                <h1 className="text-2xl font-bold text-gray-900">StyleStore</h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
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
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <CartSheet />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Featured Brands</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover products from the world's most trusted and innovative brands. From luxury fashion to everyday
            essentials, find your favorite brands all in one place.
          </p>
        </div>
      </section>

      {/* Brands Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {brands.map((brand, index) => (
              <Card key={index} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
                      <Image
                        src={`/placeholder.svg?height=60&width=80&query=${brand.logo}`}
                        alt={brand.name}
                        width={80}
                        height={60}
                        className="max-w-full h-auto opacity-70 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{brand.name}</h3>
                    <Badge variant="secondary" className="mb-3">
                      {brand.category}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-6">
                    <p className="text-gray-600 text-sm leading-relaxed">{brand.description}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Est. {brand.established}</span>
                      <span>{brand.products} products</span>
                    </div>

                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(brand.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-2">({brand.rating})</span>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    Shop {brand.name}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">StyleStore</h3>
              <p className="text-gray-600 mb-4">
                Your premier destination for fashion and style. We bring you the latest trends and timeless classics.
              </p>
              <div className="flex space-x-4">
                <Facebook className="w-5 h-5 text-gray-600 hover:text-gray-900 cursor-pointer" />
                <Twitter className="w-5 h-5 text-gray-600 hover:text-gray-900 cursor-pointer" />
                <Instagram className="w-5 h-5 text-gray-600 hover:text-gray-900 cursor-pointer" />
                <Youtube className="w-5 h-5 text-gray-600 hover:text-gray-900 cursor-pointer" />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    Size Guide
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    Returns
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Customer Service</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    Track Your Order
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-gray-600 mr-2" />
                  <span className="text-gray-600 text-sm">123 Fashion St, Style City, SC 12345</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-gray-600 mr-2" />
                  <span className="text-gray-600 text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gray-600 mr-2" />
                  <span className="text-gray-600 text-sm">support@stylestore.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">© 2024 StyleStore. All rights reserved.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-gray-600 text-sm">We accept:</span>
              <div className="flex space-x-2">
                <div className="w-8 h-5 bg-gray-300 rounded"></div>
                <div className="w-8 h-5 bg-gray-300 rounded"></div>
                <div className="w-8 h-5 bg-gray-300 rounded"></div>
                <div className="w-8 h-5 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
