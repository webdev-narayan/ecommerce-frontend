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
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/lib/cart-context"
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
    </div>
  )
}
