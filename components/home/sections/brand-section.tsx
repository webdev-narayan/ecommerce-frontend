import { Brand } from '@/app/dashboard/brands/brand.type'
import { getApi } from '@/lib/api'
import { mediaUrlGenerator } from '@/lib/utils'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const BrandSection = () => {

    const [brands, setBrands] = useState<Brand[]>([])

    useEffect(() => {
        async function getBrands() {
            const res = await getApi<{ data: Brand[] }>("/brands?populate=*")
            if (res.data) {
                setBrands(res.data.data)
            }
        }
        getBrands()
    }, [])

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Brands</h2>
                    <p className="text-gray-600">Discover products from top brands around the world</p>
                </div>
                <div className="flex gap-5 justify-center flex-wrap md:gap-8 lg:gap-x-16 ">
                    {brands.map((brand, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-center rounded-lg cursor-pointer"
                        >
                            <Image
                                src={mediaUrlGenerator(brand.thumbnail?.url)}
                                alt={brand.name}
                                width={120}
                                height={120}
                                className="w-[80px] h-[80px] hover:shadow-lg md:p-2 md:w-[120px] md:h-[120px] shadow-md shadow-gray-200 rounded-full border-gray-50 md:border-8 border-4 transition-color duration-200"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default BrandSection