"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { mediaUrlGenerator } from "@/lib/utils"
import { Media } from "@/lib/types/type"


interface ProductGalleryProps {
    gallery: Media[]
    productTitle?: string
}

export default function ProductGallery({
    gallery,
    productTitle = "Product",
}: ProductGalleryProps) {
    console.log(gallery)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({})

    const handleImageLoad = (index: number) => {
        setLoadingStates((prev) => ({ ...prev, [index]: false }))
    }

    const handleImageLoadStart = (index: number) => {
        setLoadingStates((prev) => ({ ...prev, [index]: true }))
    }

    const goToPrevious = () => {
        setSelectedImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))
    }

    const goToNext = () => {
        setSelectedImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1))
    }

    if (!gallery || gallery.length === 0) {
        return (
            <div className="w-full max-w-2xl mx-auto">
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">No images available</span>
                </div>
            </div>
        )
    }

    useEffect(() => {
        setSelectedImageIndex(0)
    }, [])

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Desktop Layout */}
            <div className="hidden md:flex gap-4 h-full">
                {/* Thumbnail Column */}
                <div className="flex flex-col gap-2 w-20 lg:w-24 overflow-y-scroll hide-scrollbar">
                    {gallery.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`relative flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 bg-gray-100 rounded-lg overflow-hidden border-2 transition-all duration-200 ${selectedImageIndex === index ? "border-gray-900 shadow-md" : "border-transparent hover:border-gray-300"
                                }`}
                        >
                            {loadingStates[index] && <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />}
                            {
                                image.mime?.includes("video") ?
                                    <video src={mediaUrlGenerator(image.url)}
                                        controls
                                        // autoPlay
                                        muted
                                        loop
                                        playsInline
                                        preload="auto"
                                        className="object-contain mx-auto"
                                        style={{ width: '100%', height: 'auto' }}
                                    >

                                    </video>
                                    :
                                    <Image
                                        src={mediaUrlGenerator(image.url) || "/placeholder.svg"}
                                        alt={image.alt || `${productTitle} view ${index + 1}`}
                                        width={96}
                                        height={96}
                                        className="w-full h-full object-cover transition-opacity duration-200"
                                        onLoadStart={() => handleImageLoadStart(index)}
                                        onLoad={() => handleImageLoad(index)}
                                        priority={index < 3}
                                    />
                            }
                        </button>
                    ))}
                </div>

                {/* Main Image */}
                <div className="flex-1 relative">
                    <div className="relative h-full bg-gray-100 rounded-lg overflow-hidden group">
                        {loadingStates[selectedImageIndex] && (
                            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg z-10" />
                        )}

                        {
                            gallery[selectedImageIndex].mime.includes("video") ?
                                <video src={mediaUrlGenerator(gallery[selectedImageIndex].url)}
                                    controls
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    preload="auto"
                                    className="object-contain mx-auto h-full"
                                // style={{ width: '100%', height: 'auto' }}
                                >

                                </video>
                                :

                                <Image
                                    src={mediaUrlGenerator(gallery[selectedImageIndex]?.url) || "/placeholder.svg"}
                                    alt={gallery[selectedImageIndex]?.alt || `${productTitle} main view`}
                                    fill
                                    className="object-cover transition-opacity duration-300"
                                    onLoadStart={() => handleImageLoadStart(selectedImageIndex)}
                                    onLoad={() => handleImageLoad(selectedImageIndex)}
                                    priority
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                        }

                        {/* Navigation Arrows */}
                        {gallery.length > 1 && (
                            <>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                                    onClick={goToPrevious}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                                    onClick={goToNext}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </>
                        )}

                        {/* Dots Indicator */}
                        {gallery.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {gallery.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`w-2 h-2 rounded-full transition-all duration-200 ${selectedImageIndex === index ? "bg-white shadow-lg" : "bg-white/50 hover:bg-white/75"
                                            }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden">
                {/* Main Image */}
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group mb-4">
                    {loadingStates[selectedImageIndex] && (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg z-10" />
                    )}

                    {

                        gallery[selectedImageIndex].mime.includes("video") ?

                            <video src={mediaUrlGenerator(gallery[selectedImageIndex].url)}
                                controls
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="auto"
                                className="object-contain mx-auto h-full"
                            // style={{ width: '100%', height: 'auto' }}
                            >

                            </video>
                            :

                            < Image
                                src={mediaUrlGenerator(gallery[selectedImageIndex]?.url) || "/placeholder.svg"}
                                alt={gallery[selectedImageIndex]?.alt || `${productTitle} main view`}
                                fill
                                className="object-cover transition-opacity duration-300"
                                onLoadStart={() => handleImageLoadStart(selectedImageIndex)}
                                onLoad={() => handleImageLoad(selectedImageIndex)}
                                priority
                                sizes="100vw"
                            />
                    }

                    {/* Navigation Arrows */}
                    {gallery.length > 1 && (
                        <>
                            <Button
                                variant="outline"
                                size="icon"
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                                onClick={goToPrevious}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                                onClick={goToNext}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </>
                    )}

                    {/* Dots Indicator */}
                    {gallery.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {gallery.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-all duration-200 ${selectedImageIndex === index ? "bg-white shadow-lg" : "bg-white/50 hover:bg-white/75"
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Thumbnail Row */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {gallery.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`relative flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border-2 transition-all duration-200 ${selectedImageIndex === index ? "border-gray-900 shadow-md" : "border-transparent hover:border-gray-300"
                                }`}
                        >
                            {loadingStates[index] && <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />}
                            {
                                image.mime.includes("video") ?
                                    <video src={mediaUrlGenerator(image.url)}
                                        controls
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        preload="auto"
                                    // className="object-contain mx-auto"
                                    // style={{ width: '100%', height: 'auto' }}
                                    >
                                    </video>
                                    :
                                    <Image
                                        src={mediaUrlGenerator(image.url) || "/placeholder.svg"}
                                        alt={image.alt || `${productTitle} view ${index + 1}`}
                                        width={64}
                                        height={64}
                                        className="w-full h-full object-cover transition-opacity duration-200"
                                        onLoadStart={() => handleImageLoadStart(index)}
                                        onLoad={() => handleImageLoad(index)}
                                    />
                            }
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
