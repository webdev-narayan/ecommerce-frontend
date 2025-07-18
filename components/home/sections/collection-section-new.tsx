import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Star } from "lucide-react"

export const CollecitonSectionNew = () => {
    const collections = [
        {
            id: 1,
            title: "Summer Essentials",
            description: "Light and comfortable pieces for the warmer months",
            image: "/placeholder.svg?height=500&width=400",
            itemCount: 24,
            href: "/collections/summer",
            size: "large",
            featured: true,
        },
        {
            id: 2,
            title: "New Arrivals",
            description: "Fresh styles just landed",
            image: "/placeholder.svg?height=300&width=400",
            itemCount: 18,
            href: "/collections/new-arrivals",
            size: "medium",
        },
        {
            id: 3,
            title: "Best Sellers",
            description: "Customer favorites you'll love",
            image: "/placeholder.svg?height=400&width=400",
            itemCount: 32,
            href: "/collections/best-sellers",
            size: "large",
        },
        {
            id: 4,
            title: "Accessories",
            description: "Complete your look",
            image: "/placeholder.svg?height=250&width=400",
            itemCount: 45,
            href: "/collections/accessories",
            size: "small",
        },
        {
            id: 5,
            title: "Sale",
            description: "Selected items at special prices",
            image: "/placeholder.svg?height=350&width=400",
            itemCount: 28,
            href: "/collections/sale",
            size: "medium",
            onSale: true,
        },
        {
            id: 6,
            title: "Premium",
            description: "Carefully crafted premium pieces",
            image: "/placeholder.svg?height=450&width=400",
            itemCount: 12,
            href: "/collections/premium",
            size: "large",
            featured: true,
        },
        {
            id: 7,
            title: "Minimalist",
            description: "Clean, timeless designs",
            image: "/placeholder.svg?height=280&width=400",
            itemCount: 16,
            href: "/collections/minimalist",
            size: "small",
        },
        {
            id: 8,
            title: "Vintage",
            description: "Classic pieces with modern appeal",
            image: "/placeholder.svg?height=380&width=400",
            itemCount: 22,
            href: "/collections/vintage",
            size: "medium",
        },
    ]

    const getSizeClass = (size: string) => {
        switch (size) {
            case "small":
                return "row-span-1"
            case "medium":
                return "row-span-2"
            case "large":
                return "row-span-3"
            default:
                return "row-span-2"
        }
    }

    const getImageHeight = (size: string) => {
        switch (size) {
            case "small":
                return "h-32"
            case "medium":
                return "h-48"
            case "large":
                return "h-64"
            default:
                return "h-48"
        }
    }

    return (
        <section className="py-16 md:py-20 lg:py-24">
            <div className="container mx-auto px-4 md:px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">Shop Collections</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Discover our carefully curated collections designed for every style and occasion
                    </p>
                </div>

                {/* Masonry Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-[140px]">
                    {collections.map((collection) => (
                        <Card
                            key={collection.id}
                            className={`group overflow-hidden hover:shadow-lg transition-all duration-300 ${getSizeClass(collection.size)}`}
                        >
                            <CardContent className="p-0 h-full relative">
                                <div className="relative overflow-hidden h-full">
                                    <Image
                                        src={collection.image || "/placeholder.svg"}
                                        alt={collection.title}
                                        width={400}
                                        height={500}
                                        className={`w-full ${getImageHeight(collection.size)} object-cover transition-transform duration-300 group-hover:scale-105`}
                                    />

                                    {/* Subtle overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                                    {/* Badges */}
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        {collection.featured && (
                                            <Badge variant="secondary" className="text-xs">
                                                <Star className="h-3 w-3 mr-1" />
                                                Featured
                                            </Badge>
                                        )}
                                        {collection.onSale && (
                                            <Badge variant="destructive" className="text-xs">
                                                Sale
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Item count */}
                                    <div className="absolute top-3 right-3">
                                        <Badge variant="outline" className="text-xs bg-background/80 backdrop-blur-sm">
                                            {collection.itemCount} items
                                        </Badge>
                                    </div>

                                    {/* Content overlay */}
                                    <div className="absolute inset-0 p-4 flex flex-col justify-end">
                                        <div className="bg-background/95 backdrop-blur-sm rounded-lg p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <h3 className="font-semibold text-lg mb-1 leading-tight">{collection.title}</h3>

                                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{collection.description}</p>

                                            <Link href={collection.href}>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent"
                                                >
                                                    Shop Now
                                                    <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* View All Collections Button */}
                <div className="text-center mt-12">
                    <Link href="/collections">
                        <Button variant="outline" size="lg">
                            View All Collections
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
