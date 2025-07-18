"use client"

import { useEffect, useState } from "react"
import {
  ArrowRight,
} from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"
import { Collection } from "../dashboard/collections/collection.type"
import { getApi } from "@/lib/api"
import { BannerPlacement } from "@/lib/types/type"
import React from "react"
import { Banner } from "../dashboard/banners/banner.type"
import { ImageCarousel } from "@/components/image-carousel"
import { mediaUrlGenerator } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export default function CollectionsPage() {
  const { getTotalItems } = useCart()
  const [collections, setCollections] = useState<Collection[]>([])
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const fetchBanners = async () => {
    const query = new URLSearchParams()
    query.append("populate", "*")
    query.append("filters[placement][$eq]", BannerPlacement.COLLECTION)
    const response = await getApi<{ data: Banner[] }>(`/banners?${query.toString()}`, false)
    if (response.data) {
      setBanners(response.data?.data)
    }
  }

  const fetchCollections = async () => {
    const response = await getApi<{ data: Collection[] }>(`/collections?populate=thumbnail`, false)
    if (response.data) {
      setCollections(response.data?.data)
    }
  }

  useEffect(() => {
    fetchBanners()
    fetchCollections()
    setIsLoading(false)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])


  return (
    <div className="min-h-screen bg-gray-50">

      {
        isLoading ? <div className="mt-10 container mx-auto py-6">
          <Skeleton className="aspect-[4/1]">

          </Skeleton>
          <Skeleton className="py-16 mt-10 w-[60%] mx-auto">

          </Skeleton>

          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {
                  [1, 2, 3, 4, 5].map(item => {
                    return <Skeleton key={item} className="aspect-square">

                    </Skeleton>
                  })
                }
              </div>
            </div>
          </section>

        </div>
          :
          <>
            <div className="mt-10 container mx-auto py-6">
              <ImageCarousel
                images={banners.map(item => item.image.url)}
                width={1000}
                height={1000}
                className="md:aspect-[4/1] aspect-[3/1] rounded-md overflow-hidden"
              />
            </div>

            {/* Hero Section */}
            <section className="bg-white py-16">
              <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Top Collections</h1>
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
                            src={mediaUrlGenerator(collection.thumbnail?.url)}
                            alt={collection.title}
                            width={400}
                            height={300}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                        </div>
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">{collection.title}</h3>
                          </div>
                          <p className="text-gray-600 mb-4 text-sm leading-relaxed">{collection.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Products {100}</span>
                            <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-900">
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
          </>
      }

    </div>
  )
}
