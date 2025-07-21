"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/app/dashboard/products/product.type"
import ProductCard from "@/components/product-card"
import { productStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { getApi } from "@/lib/api"


const WishlistPage = () => {
    const [likedProducts, setLikedProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [likedProductIds, setLikedProductIds] = useState<number[]>([])

    useEffect(() => {
        const loadLikedProducts = async () => {
            try {
                const ids = productStore.getLikedProducts() || []
                setLikedProductIds(ids)

                if (ids.length > 0) {

                    const res = await getApi<Product[]>(`/products/by-ids/${ids}`, false)
                    if (res.data) {
                        setLikedProducts(res.data)
                    }
                }
            } catch (error) {
                console.error("Error loading liked products:", error)
            } finally {
                setLoading(false)
            }
        }

        loadLikedProducts()
    }, [])

    const handleProductRemoved = (productId: number) => {
        setLikedProducts((prev) => prev.filter((product) => product.id !== productId))
        setLikedProductIds((prev) => prev.filter((id) => id !== productId))
    }

    const clearAllWishlist = () => {
        const ids = [...likedProductIds]
        ids.forEach((id) => productStore.removeFromLikes(id))
        setLikedProducts([])
        setLikedProductIds([])
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <div key={index} className="bg-white rounded-lg p-4">
                                    <div className="aspect-square bg-gray-200 rounded mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                                <Heart className="h-6 w-6 text-red-500 fill-red-500" />
                                My Wishlist
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {likedProducts.length} {likedProducts.length === 1 ? "item" : "items"} saved
                            </p>
                        </div>
                    </div>

                    {likedProducts.length > 0 && (
                        <Button variant="outline" onClick={clearAllWishlist} className="hidden sm:flex bg-transparent">
                            Clear All
                        </Button>
                    )}
                </div>

                <Separator className="mb-8" />

                {/* Empty State */}
                {likedProducts.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <Heart className="h-12 w-12 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Save items you love by clicking the heart icon. They'll appear here for easy access later.
                        </p>
                        <Link href="/products">
                            <Button className="inline-flex items-center gap-2">
                                <ShoppingBag className="h-4 w-4" />
                                Start Shopping
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Mobile Clear All Button */}
                        <div className="sm:hidden mb-6">
                            <Button variant="outline" onClick={clearAllWishlist} className="w-full bg-transparent">
                                Clear All Items
                            </Button>
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {likedProducts.map((product) => (
                                <div key={product.id} className="relative">
                                    <ProductCard product={product} showAddToCart={true} showAddToWishlist={true} />
                                </div>
                            ))}
                        </div>

                        {/* Bottom Actions */}
                        <div className="mt-12 text-center">
                            <Link href="/products">
                                <Button variant="outline" className="inline-flex items-center gap-2 bg-transparent">
                                    <ShoppingBag className="h-4 w-4" />
                                    Continue Shopping
                                </Button>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default WishlistPage
