"use client"

import React, { useEffect } from "react"
import {
  ArrowRight, Star,
} from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

const BrandsPage = () => {
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

      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Featured Brands</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover products from the world`&apos;`s most trusted and innovative brands. From luxury fashion to everyday
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
                            className={`w-4 h-4 ${i < Math.floor(brand.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
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

    </div>
  )
}
export default BrandsPage