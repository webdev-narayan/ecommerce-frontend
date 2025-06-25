"use client"

import { useEffect } from "react"
import {
  ArrowRight,
} from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"

export default function CollectionsPage() {
  const { getTotalItems } = useCart()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const collections = [
    {
      name: "Summer Essentials",
      description: "Light and breezy pieces perfect for warm weather adventures and sunny days.",
      items: "24 items",
      image: "summer fashion collection",
      price: "From $29",
      season: "Summer 2024",
    },
    {
      name: "Business Casual",
      description: "Professional looks that work seamlessly from office meetings to dinner dates.",
      items: "18 items",
      image: "business casual collection",
      price: "From $59",
      season: "All Season",
    },
    {
      name: "Weekend Vibes",
      description: "Comfortable and stylish pieces for your relaxing days off and casual outings.",
      items: "32 items",
      image: "weekend casual collection",
      price: "From $39",
      season: "All Season",
    },
    {
      name: "Evening Elegance",
      description: "Sophisticated pieces for special occasions and memorable nights out.",
      items: "15 items",
      image: "evening wear collection",
      price: "From $89",
      season: "All Season",
    },
    {
      name: "Active Lifestyle",
      description: "Performance wear that keeps up with your active lifestyle and fitness goals.",
      items: "28 items",
      image: "activewear collection",
      price: "From $45",
      season: "All Season",
    },
    {
      name: "Winter Warmth",
      description: "Cozy and stylish pieces to keep you warm during the coldest months.",
      items: "21 items",
      image: "winter fashion collection",
      price: "From $79",
      season: "Winter 2024",
    },
    {
      name: "Minimalist Modern",
      description: "Clean lines and timeless designs for the modern minimalist aesthetic.",
      items: "19 items",
      image: "minimalist fashion collection",
      price: "From $49",
      season: "All Season",
    },
    {
      name: "Vintage Revival",
      description: "Classic styles reimagined for today's fashion-forward individuals.",
      items: "26 items",
      image: "vintage fashion collection",
      price: "From $55",
      season: "All Season",
    },
    {
      name: "Urban Explorer",
      description: "Street-style inspired pieces for the modern city dweller and trendsetter.",
      items: "23 items",
      image: "urban streetwear collection",
      price: "From $42",
      season: "All Season",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Curated Collections</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our thoughtfully curated collections designed for every style, season, and occasion. Each
            collection tells a unique story and brings together pieces that work beautifully together.
          </p>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection, index) => (
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
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-white/90 text-gray-900">
                        {collection.season}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                        Explore Collection
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{collection.name}</h3>
                      <span className="text-sm font-medium text-gray-600">{collection.price}</span>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{collection.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{collection.items}</span>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                        View All
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">New Collection Alert</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Be the first to discover our latest collection. Sign up for exclusive early access and special offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input placeholder="Enter your email" className="bg-white text-black border-0" />
            <Button className="bg-white text-black hover:bg-gray-100">Get Early Access</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
