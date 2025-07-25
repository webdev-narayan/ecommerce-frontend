import { Banner } from '@/app/dashboard/banners/banner.type'
import { Category } from '@/app/dashboard/categories/categories.type'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getApi } from '@/lib/api'
import { BannerPlacement } from '@/lib/types/type'
import { mediaUrlGenerator } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const CategorySection = () => {

    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState<boolean>(true)


    useEffect(() => {
        async function getCateogries() {

            const res = await getApi<{ data: Category[] }>("/categories?pagination[page]=1&pagination[pageSize]=6&populate=thumbnail")
            if (res.data) {
                setCategories(res.data.data)
            }
            setLoading(false)
        }
        getCateogries()
    }, [])

    const SkeletonComp = () => (
        <Card className="border shadow-none">
            <CardContent className="p-0 aspect-square border-none group">
                <div className="rounded-md overflow-hidden md:w-[170px] md:h-[170px] w-[100px] h-[100px] mx-auto">
                    <Skeleton
                        className="w-full h-full"
                    />
                </div>
                <div className="p-4">
                    <Skeleton className="w-full h-6 bg-gray-100 px-10"></Skeleton>
                    {/* <p className="text-gray-500 text-sm">{category?.count || 0}</p> */}
                </div>
            </CardContent>
        </Card>
    )

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Categories</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Explore our wide range of categories to find exactly what you're looking for.
                    </p>
                </div>
                <div className=" grid grid-cols-3 gap-3 md:flex md:gap-10 flex-wrap justify-center items-center">
                    {
                        loading ? [...Array(4)].map((item, index) => {
                            return <SkeletonComp key={index} />
                        }) :
                            categories.map((category, index) => (
                                <Card key={index} className="shadow-none aspect-square border-none bg-transparent">
                                    <CardContent className="p-0 aspect-square border-none group">
                                        <div className="rounded-md overflow-hidden md:w-[170px] md:h-[170px] w-[100px] h-[100px] mx-auto">
                                            <Image
                                                src={mediaUrlGenerator(category.thumbnail?.url)}
                                                alt={category.name}
                                                width={500}
                                                height={500}
                                                // className="object-cover group-hover:scale-105 transition-transform duration-300 group-hover:object-top-left absolute top-0 left-0"
                                                className="transition-transform duration-300 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="p-4 text-center">
                                            <h3 className="font-semibold text-gray-900 mb-1 md:text-base text-sm ">{category.name}</h3>
                                            {/* <p className="text-gray-500 text-sm">{category?.count || 0}</p> */}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                </div>
                <div className="text-center mt-12">
                    <Button onClick={() => redirect("/categories")} variant="outline" size="lg">
                        View All Categories
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default CategorySection