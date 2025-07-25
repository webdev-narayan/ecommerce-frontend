"use client"

import { useEffect, useState } from "react"
import { ArrowRight, } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Category } from "../dashboard/categories/categories.type"
import { getApi } from "@/lib/api"
import { mediaUrlGenerator } from "@/lib/utils"
import React from "react"
import { BannerPlacement } from "@/lib/types/type"
import { Banner } from "../dashboard/banners/banner.type"
import { ImageCarousel } from "@/components/image-carousel"
import { Skeleton } from "@/components/ui/skeleton"
import { redirect } from "next/navigation"

export default function CategoriesPage() {

  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [banners, setBanners] = useState<Banner[]>([])

  const fetchBanners = async () => {
    const query = new URLSearchParams()
    query.append("filters[placement]", BannerPlacement.CATEGORY)
    query.append("populate", "image")
    const res = await getApi<{ data: Banner[] }>(`/banners?${query.toString()}`)
    if (res.data) {
      setBanners(res.data.data)
    }
  }

  const getCategories = async () => {
    const query = new URLSearchParams()
    query.append("populate[0]", "thumbnail")
    const res = await getApi<{ data: Category[] }>(`/categories?${query.toString()}`,)
    if (res.data) {
      setCategories(res.data.data)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    Promise.all([
      fetchBanners(),
      getCategories()
    ])
    setIsLoading(false)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])


  return (
    <div className="min-h-screen">

      {
        isLoading ?
          <div className="mt-10 container mx-auto py-6">
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
            {banners.length > 0 &&
              <div className="mt-10 container mx-auto py-6">
                <ImageCarousel
                  images={banners.map(item => item.image.url)}
                  width={1000}
                  height={1000}
                  className="md:aspect-[4/1] aspect-[3/1] rounded-xl overflow-hidden"
                />
              </div>
            }
            {/* Hero Section */}
            <section className="bg-white lg:py-16 py-6">
              <div className="container mx-auto px-4 text-center">
                <h1 className="lg:text-4xl text-3xl font-bold text-gray-900 mb-4">Shop by Category</h1>
                <p className="lg:text-xl text-lg text-gray-600 max-w-3xl mx-auto">
                  Explore our diverse range of categories to find exactly what you're looking for. From fashion essentials to
                  lifestyle accessories, we have everything you need.
                </p>
              </div>
            </section>

            {/* Categories Grid */}
            <section className="py-16">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-8 gap-x-3 gap-y-4">
                  {categories.map((category, index) => (
                    <Card key={index} className="group cursor-pointer hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <Image
                            src={mediaUrlGenerator(category.thumbnail?.url)}
                            alt={category.name}
                            width={350}
                            height={250}
                            className="md:w-full md:h-64 aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="lg:p-6 p-2">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                          <p className="text-gray-600 mb-4 text-sm hidden md:block leading-relaxed">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet, similique?</p>
                          <div className="flex items-center justify-end w-full">
                            {/* <span className="text-sm text-gray-500">{10}</span> */}
                            <Button variant="outline" className="w-full md:w-fit" onClick={() => redirect(`/shop?category=${category.id}`)} size="sm">
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
          </>
      }
    </div >
  )
}
