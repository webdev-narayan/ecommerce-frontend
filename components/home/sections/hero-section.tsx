import { Banner } from '@/app/dashboard/banners/banner.type'
import { ImageCarousel } from '@/components/image-carousel'
import { Skeleton } from '@/components/ui/skeleton'
import { getApi } from '@/lib/api'
import React, { useEffect, useState } from 'react'

const HeroSection = () => {

    const [banners, setBanners] = useState<Banner[]>([])
    const [loading, setIsLoading] = useState<boolean>(true)

    const getBanners = async () => {
        setIsLoading(true)
        const res = await getApi<{ data: Banner[] }>("banners?populate=*", false)
        if (res.data && res.success) {
            setBanners(res.data.data)
        }
        setIsLoading(false)
    }
    useEffect(() => {
        Promise.all([
            getBanners()]
        )
    }, [])

    return (
        <div className="md:mt-10 mt-3">
            {loading ?
                <Skeleton className='w-full aspect-[3/1] md:aspect-[4/1] bg-gray-100' />
                :
                <ImageCarousel
                    images={banners.map(item => item.image.url)}
                    width={2000}
                    height={500}
                    className="md:aspect-[4/1] aspect-[3/1]"
                />
            }
        </div>
    )
}

export default HeroSection