"use client"

import { useEffect } from "react"
import {
  Search,
  User,
  Heart,
  Menu,
  Star,
  ArrowRight,
  ChevronUp,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Truck,
  Shield,
  RotateCcw,
  Headphones,
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

export default function StoreFront() {
  // Scroll to top functionality
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const { getTotalItems } = useCart()

  return (
    <div className="min-h-screen bg-gray-50">


      {/* Hero Banner */}
      <section className="relative bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                New Collection
                <span className="block text-gray-600">Winter 2024</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Discover our latest winter collection featuring premium quality and modern designs.
              </p>
              <div className="flex space-x-4">
                <Button size="lg" className="bg-gray-900 hover:bg-gray-800">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg">
                  View Lookbook
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=500&width=600&query=winter fashion model"
                alt="Winter Collection"
                width={600}
                height={500}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-gray-600 text-sm">On orders over $50</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Easy Returns</h3>
              <p className="text-gray-600 text-sm">30-day return policy</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-gray-600 text-sm">100% secure checkout</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm">Customer service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of categories to find exactly what you're looking for.
            </p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { name: "Men's Fashion", image: "mens fashion clothing", count: "245 items" },
              { name: "Women's Fashion", image: "womens fashion clothing", count: "389 items" },
              { name: "Accessories", image: "fashion accessories", count: "156 items" },
              { name: "Shoes", image: "fashion shoes", count: "198 items" },
              { name: "Bags", image: "fashion bags", count: "87 items" },
              { name: "Jewelry", image: "fashion jewelry", count: "134 items" },
              { name: "Watches", image: "fashion watches", count: "76 items" },
              { name: "Sunglasses", image: "fashion sunglasses", count: "92 items" },
            ].map((category, index) => (
              <Card key={index} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={`/placeholder.svg?height=200&width=300&query=${category.image}`}
                      alt={category.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                    <p className="text-gray-500 text-sm">{category.count}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Brands</h2>
            <p className="text-gray-600">Discover products from top brands around the world</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {["Nike", "Adidas", "Puma", "Zara", "H&M", "Uniqlo"].map((brand, index) => (
              <div
                key={index}
                className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <Image
                  src={`/placeholder.svg?height=80&width=120&query=${brand} logo`}
                  alt={brand}
                  width={120}
                  height={80}
                  className="max-w-full h-auto opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600">Handpicked products just for you</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Classic White Sneakers",
                price: "$89.99",
                originalPrice: "$119.99",
                rating: 4.5,
                image: "white sneakers",
              },
              { name: "Denim Jacket", price: "$79.99", originalPrice: null, rating: 4.8, image: "denim jacket" },
              {
                name: "Leather Handbag",
                price: "$159.99",
                originalPrice: "$199.99",
                rating: 4.6,
                image: "leather handbag",
              },
              { name: "Wool Sweater", price: "$69.99", originalPrice: null, rating: 4.7, image: "wool sweater" },
              {
                name: "Running Shoes",
                price: "$129.99",
                originalPrice: "$149.99",
                rating: 4.9,
                image: "running shoes",
              },
              { name: "Silk Scarf", price: "$39.99", originalPrice: null, rating: 4.4, image: "silk scarf" },
              {
                name: "Casual T-Shirt",
                price: "$24.99",
                originalPrice: "$34.99",
                rating: 4.3,
                image: "casual t-shirt",
              },
              { name: "Winter Coat", price: "$199.99", originalPrice: "$249.99", rating: 4.8, image: "winter coat" },
            ].map((product, index) => (
              <Card key={index} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={`/placeholder.svg?height=250&width=300&query=${product.image}`}
                      alt={product.name}
                      width={300}
                      height={250}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Button size="icon" variant="ghost" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
                      <Heart className="h-4 w-4" />
                    </Button>
                    {product.originalPrice && <Badge className="absolute top-2 left-2 bg-red-500">Sale</Badge>}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-2">({product.rating})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-900">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Collections</h2>
            <p className="text-gray-600">Curated collections for every style and occasion</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Summer Essentials",
                description: "Light and breezy pieces perfect for warm weather",
                items: "24 items",
                image: "summer fashion collection",
              },
              {
                name: "Business Casual",
                description: "Professional looks that work from office to dinner",
                items: "18 items",
                image: "business casual collection",
              },
              {
                name: "Weekend Vibes",
                description: "Comfortable and stylish pieces for your days off",
                items: "32 items",
                image: "weekend casual collection",
              },
            ].map((collection, index) => (
              <Card key={index} className="group cursor-pointer hover:shadow-lg transition-shadow overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src={`/placeholder.svg?height=300&width=400&query=${collection.image}`}
                      alt={collection.name}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <h3 className="text-2xl font-bold mb-2">{collection.name}</h3>
                        <p className="mb-4 opacity-90">{collection.description}</p>
                        <Badge variant="secondary" className="mb-4">
                          {collection.items}
                        </Badge>
                        <div>
                          <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                            Explore Collection
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay in the Loop</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new arrivals, exclusive offers, and style tips.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input placeholder="Enter your email" className="bg-white text-black border-0" />
            <Button className="bg-white text-black hover:bg-gray-100">Subscribe</Button>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <Button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 rounded-full w-12 h-12 bg-gray-900 hover:bg-gray-800 shadow-lg"
        size="icon"
      >
        <ChevronUp className="h-6 w-6" />
      </Button>
    </div>
  )
}
