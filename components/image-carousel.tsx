
// import { Card, CardContent } from "@/components/ui/card"
// import {
//     Carousel,
//     CarouselContent,
//     CarouselItem,
//     CarouselNext,
//     CarouselPrevious,
// } from "@/components/ui/carousel"
// import Image from "next/image"
// import { mediaUrlGenerator } from "@/lib/utils"
// import { useEffect, useRef, useState } from "react"

// export function ImageCarousel({ images }: { images: string[] }) {
//     if (!images || !images.length) return null

//     const ref = useRef(null)
//     setInterval(() => ref?.current?.click(), 2000)
//     useEffect(() => {
//     }, [])
//     return (
//         <Carousel
//             opts={{
//                 loop: true
//             }}
//             className="w-full relative">
//             <CarouselContent>
//                 {images.map((item, index) => (
//                     <CarouselItem key={index}>
//                         <div className="">
//                             <Card className="p-0">
//                                 <CardContent className="flex items-center justify-center p-0 aspect-[2/1]">
//                                     <Image
//                                         src={mediaUrlGenerator(item)}
//                                         height={1000}
//                                         width={1000}
//                                         alt="banner"
//                                         className="w-full h-full object-cover"
//                                     />
//                                 </CardContent>
//                             </Card>
//                         </div>
//                     </CarouselItem>
//                 ))}
//             </CarouselContent>
//             <CarouselPrevious className="absolute top-1/2 left-10" />
//             <CarouselNext ref={ref} className="absolute top-1/2 right-10" />
//         </Carousel>
//     )
// }



"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"
import Image from "next/image"
import { mediaUrlGenerator } from "@/lib/utils"
import { useState, useEffect } from "react"
import { twMerge } from "tailwind-merge"

export function ImageCarousel({ images, width, height, className }: {
    images: string[],
    width: number,
    height: number,
    className?: string
}) {
    const [api, setApi] = useState<CarouselApi>()


    // Auto-play functionality
    useEffect(() => {
        if (!api) return

        // Auto-play interval
        const autoPlay = setInterval(() => {
            if (api.canScrollNext()) {
                api.scrollNext()
            } else {
                // Loop back to first slide
                api.scrollTo(0)
            }
        }, 3000) // Change slide every 3 seconds

        // Pause auto-play when user interacts
        const handleUserInteraction = () => {
            clearInterval(autoPlay)

            // Resume auto-play after 5 seconds of no interaction
            setTimeout(() => {
                const newAutoPlay = setInterval(() => {
                    if (api.canScrollNext()) {
                        api.scrollNext()
                    } else {
                        api.scrollTo(0)
                    }
                }, 3000)

                // Store interval ID for cleanup
                return () => clearInterval(newAutoPlay)
            }, 5000)
        }

        // Add event listeners for user interaction
        api.on("pointerDown", handleUserInteraction)

        // Cleanup
        return () => {
            clearInterval(autoPlay)
            api.off("select", () => { })
            api.off("pointerDown", handleUserInteraction)
        }
    }, [api])

    if (!images || !images.length) return null

    return (
        <div className="w-full relative">
            <Carousel
                setApi={setApi}
                className="w-full relative"
                opts={{
                    align: "start",
                    loop: true, // Enable infinite loop
                }}
            >
                <CarouselContent>
                    {images.map((item, index) => (
                        <CarouselItem key={index}>
                            <div className="">
                                <Card className={`${twMerge("p-0 border-none shadow-none rounded-none", className)}`}>
                                    <CardContent className={`${twMerge("flex items-center justify-center p-0 aspect-[4/1]", className)}`}>
                                        <Image
                                            src={mediaUrlGenerator(item) || "/placeholder.svg"}
                                            height={height}
                                            width={width}
                                            alt={`banner ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            priority={index === 0} // Prioritize first image
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute top-1/2 left-4 z-10" />
                <CarouselNext className="absolute top-1/2 right-4 z-10" />
            </Carousel>
        </div>
    )
}
