"use client"

import { useEffect } from "react"
import { ArrowRight, } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
export default function CategoriesPage() {

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const categories = [
    {
      name: "Men's Fashion",
      image: "mens fashion clothing",
      count: "245 items",
      description: "Discover the latest trends in men's fashion from casual wear to formal attire.",
    },
    {
      name: "Women's Fashion",
      image: "womens fashion clothing",
      count: "389 items",
      description:
        "Explore our extensive collection of women's clothing, from everyday essentials to statement pieces.",
    },
    {
      name: "Accessories",
      image: "fashion accessories",
      count: "156 items",
      description: "Complete your look with our curated selection of fashion accessories.",
    },
    {
      name: "Shoes",
      image: "fashion shoes",
      count: "198 items",
      description: "Step out in style with our diverse range of footwear for every occasion.",
    },
    {
      name: "Bags",
      image: "fashion bags",
      count: "87 items",
      description: "Carry your essentials in style with our collection of handbags and backpacks.",
    },
    {
      name: "Jewelry",
      image: "fashion jewelry",
      count: "134 items",
      description: "Add sparkle to your outfit with our beautiful jewelry collection.",
    },
    {
      name: "Watches",
      image: "fashion watches",
      count: "76 items",
      description: "Keep time in style with our selection of elegant and sporty watches.",
    },
    {
      name: "Sunglasses",
      image: "fashion sunglasses",
      count: "92 items",
      description: "Protect your eyes while looking fashionable with our sunglasses collection.",
    },
    {
      name: "Activewear",
      image: "activewear clothing",
      count: "143 items",
      description: "Stay comfortable and stylish during your workouts with our activewear.",
    },
    {
      name: "Outerwear",
      image: "outerwear jackets",
      count: "89 items",
      description: "Stay warm and fashionable with our collection of coats and jackets.",
    },
    {
      name: "Electronics",
      image: "fashion electronics",
      count: "67 items",
      description: "Tech accessories that complement your style and enhance your lifestyle.",
    },
    {
      name: "Home & Living",
      image: "home decor",
      count: "112 items",
      description: "Stylish home accessories and decor to elevate your living space.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our diverse range of categories to find exactly what you're looking for. From fashion essentials to
            lifestyle accessories, we have everything you need.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Card key={index} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={`/placeholder.svg?height=250&width=350&query=${category.image}`}
                      alt={category.name}
                      width={350}
                      height={250}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{category.count}</span>
                      <Button variant="outline" size="sm">
                        Shop Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
