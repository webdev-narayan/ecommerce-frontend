"use client"

import { useEffect, } from "react"
import { ChevronUp, } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
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
