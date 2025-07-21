"use client"

import { useEffect, useState } from "react"
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
import { CartSheet } from "@/components/cart/cart-sheet"
import { ImageCarousel } from "@/components/image-carousel"
import { Banner } from "./dashboard/banners/banner.type"
import { getApi } from "@/lib/api"
import FeatureSection from "@/components/home/sections/feature-section"
import CategorySection from "@/components/home/sections/category-section"
import BrandSection from "@/components/home/sections/brand-section"
import FeatureProductSection from "@/components/home/sections/feature-product-section"
import CollectionSection from "@/components/home/sections/collection-section"
import NewsLetter from "@/components/home/sections/news-letter"
import HeroSection from "@/components/home/sections/hero-section"
// import { CollecitonSectionNew } from "@/components/home/sections/collection-section-new"

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
      <HeroSection />
      {/* Hero Banner */}
      {/* <section className="relative bg-gray-100 py-20">
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
      </section> */}

      {/* Features */}
      <FeatureSection />

      {/* Categories */}
      <CategorySection />

      {/* Brands */}
      <BrandSection />

      {/* Featured Products */}
      <FeatureProductSection />

      {/* Collections */}
      <CollectionSection />

      {/* <CollecitonSectionNew /> */}

      {/* Newsletter */}
      <NewsLetter />

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
