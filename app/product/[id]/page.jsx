"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import {
  Star,
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  RotateCcw,
  Shield,
  Share2,
  ChevronLeft,
  ChevronRight,
  Search,
  User,
  Menu,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MapPin,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/cart-context"
import { CartSheet } from "@/components/cart-sheet"
import { toast } from "sonner"

export default function ProductPage() {
  const params = useParams()
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const { addItem, getTotalItems } = useCart()

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Sample product data based on ID - in real app, this would be fetched from API
  const getProductById = (id) => {
    const products = {
      1: {
        id: 1,
        name: "Classic White Sneakers",
        price: 89.99,
        originalPrice: 119.99,
        rating: 4.5,
        reviews: 128,
        brand: "Nike",
        category: "Shoes",
        description:
          "Step into comfort and style with these classic white sneakers. Crafted with premium materials and featuring a timeless design that pairs perfectly with any outfit.",
        features: [
          "Premium leather upper",
          "Cushioned midsole for comfort",
          "Durable rubber outsole",
          "Classic lace-up design",
        ],
        images: [
          "white sneakers front view",
          "white sneakers side view",
          "white sneakers back view",
          "white sneakers sole view",
        ],
        inStock: true,
        stockCount: 15,
        isOnSale: true,
      },
      2: {
        id: 2,
        name: "Denim Jacket",
        price: 79.99,
        originalPrice: 99.99,
        rating: 4.3,
        reviews: 89,
        brand: "Levi's",
        category: "Jackets",
        description:
          "A timeless denim jacket that never goes out of style. Perfect for layering and adding a casual touch to any outfit.",
        features: ["100% cotton denim", "Classic button closure", "Chest pockets", "Adjustable cuffs"],
        images: ["denim jacket front", "denim jacket back", "denim jacket detail", "denim jacket styled"],
        inStock: true,
        stockCount: 8,
        isOnSale: true,
      },
      3: {
        id: 3,
        name: "Wireless Headphones",
        price: 199.99,
        originalPrice: 249.99,
        rating: 4.7,
        reviews: 256,
        brand: "Sony",
        category: "Electronics",
        description:
          "Premium wireless headphones with noise cancellation and superior sound quality for the ultimate listening experience.",
        features: [
          "Active noise cancellation",
          "30-hour battery life",
          "Wireless connectivity",
          "Premium sound quality",
        ],
        images: ["headphones front", "headphones side", "headphones case", "headphones wearing"],
        inStock: true,
        stockCount: 12,
        isOnSale: true,
      },
    }
    return products[id] || products[1] // Default to product 1 if ID not found
  }

  const product = getProductById(Number.parseInt(params.id))

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= product.stockCount) {
      setQuantity(newQuantity)
    }
  }

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  const handleAddToCart = () => {
    addItem(product, quantity)
    toast.success(`${quantity} ${product.name}${quantity > 1 ? "s" : ""} added to cart!`)
  }

  return (
    <div className="min-h-screen bg-white">
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

      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-gray-600">
            <Link href="/shop" className="hover:text-gray-900">
              Shop
            </Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-gray-900">
              {product.category}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={`/placeholder.svg?height=600&width=600&query=${product.images[selectedImageIndex]}`}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
              {product.isOnSale && <Badge className="absolute top-4 left-4 bg-red-500">Sale</Badge>}

              {/* Image Navigation */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                    selectedImageIndex === index ? "border-gray-900" : "border-transparent"
                  }`}
                >
                  <Image
                    src={`/placeholder.svg?height=150&width=150&query=${image}`}
                    alt={`${product.name} view ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <p className="text-gray-600 mb-2">{product.brand}</p>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 ml-2">({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
                )}
                {product.isOnSale && (
                  <Badge variant="destructive">Save ${(product.originalPrice - product.price).toFixed(2)}</Badge>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stockCount}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-gray-600">{product.stockCount} items available</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
              <Button variant="outline" size="lg" className="w-full">
                Buy Now
              </Button>
            </div>

            {/* Features */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <Truck className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                    <p className="text-sm font-medium">Free Shipping</p>
                    <p className="text-xs text-gray-500">On orders over $50</p>
                  </div>
                  <div>
                    <RotateCcw className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                    <p className="text-sm font-medium">Easy Returns</p>
                    <p className="text-xs text-gray-500">30-day policy</p>
                  </div>
                  <div>
                    <Shield className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                    <p className="text-sm font-medium">Secure Payment</p>
                    <p className="text-xs text-gray-500">100% protected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Product Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <p className="text-gray-500">Reviews coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Free Standard Shipping</h4>
                      <p className="text-gray-600">5-7 business days • Free on orders over $50</p>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-medium text-gray-900">Express Shipping</h4>
                      <p className="text-gray-600">2-3 business days • $9.99</p>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-medium text-gray-900">Next Day Delivery</h4>
                      <p className="text-gray-600">1 business day • $19.99</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
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
