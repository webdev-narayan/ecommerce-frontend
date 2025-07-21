"use client"

import React, { useEffect, useState } from "react"
import {
  ArrowRight, Star,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { getApi } from "@/lib/api"
import { Brand } from "../dashboard/brands/brand.type"
import { mediaUrlGenerator } from "@/lib/utils"
import { Banner } from "../dashboard/banners/banner.type"
import { BannerPlacement } from "@/lib/types/type"
import { ImageCarousel } from "@/components/image-carousel"
import { Skeleton } from "@/components/ui/skeleton"
import { redirect } from "next/navigation"

const BrandsPage = () => {
  const [brands, setBrands] = useState<Brand[]>([])
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const fetchBanners = async () => {
    const query = new URLSearchParams()
    query.append("populate", "*")
    query.append("filters[placement][$eq]", BannerPlacement.BRAND)
    const response = await getApi<{ data: Banner[] }>(`/banners?${query.toString()}`, false)
    if (response.data) {
      setBanners(response.data?.data)
    }
  }


  const fetchBrands = async () => {
    const query = new URLSearchParams()
    query.append("sort", "createdAt:desc")
    query.append("populate", "thumbnail")
    const response = await getApi<{ data: Brand[] }>(`/brands?${query.toString()}`, false)
    if (response.data) {
      setBrands(response.data?.data)
    }
  }

  useEffect(() => {
    fetchBanners()
    fetchBrands()
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
                className="md:aspect-[4/1] aspect-[3/1] rounded-xl overflow-hidden"
              />
            </div>

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
                              src={mediaUrlGenerator(brand.thumbnail?.url)}
                              alt={brand.name}
                              width={80}
                              height={60}
                              className="max-w-full h-auto opacity-70 group-hover:opacity-100 transition-opacity"
                            />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{brand.name}</h3>
                          {/* <Badge variant="secondary" className="mb-3">
                      {brand.category}
                    </Badge> */}
                        </div>

                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={() => redirect(`/shop?brand=${brand.id}`)}
                        >
                          Shop {brand.name}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          </>
      }



    </div>
  )
}
export default BrandsPage