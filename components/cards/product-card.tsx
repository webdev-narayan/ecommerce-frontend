import { Product } from '@/app/dashboard/products/product.type'
import React, { useState } from 'react'
import { Card, CardContent } from '../ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { mediaUrlGenerator } from '@/lib/utils'
import { Button } from '../ui/button'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { Badge } from '../ui/badge'
import { useCart } from '@/lib/cart-context'
import { toast } from 'sonner'
import { productStore } from '@/lib/store'
import VideoPlayer from '../video-player'

interface ProductCardProps {
    product: Product;
    showAddToCart?: boolean;
    showAddToWishlist?: boolean;
}

const ProductCard = ({ product, showAddToCart,
    showAddToWishlist }: ProductCardProps) => {
    const { addItem, getTotalItems } = useCart()
    const [liked, setLiked] = useState<number[]>(productStore.getLikedProducts() || [])

    const handleAddToCart = (product: Product) => {
        addItem(product, 1)
        toast.success(`${product.title} added to cart!`)
    }

    const handleLike = (productId: number) => {
        if (!liked.includes(productId)) {
            setLiked([...liked, productId])
            productStore.addToLikes(productId)
        } else {
            setLiked(liked.filter((id) => id !== productId))
            productStore.removeFromLikes(productId)
        }
    }


    return (
        <Card key={product.id} className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-0">

                <div className="relative overflow-hidden rounded-t-lg aspect-square">
                    <Link href={`/product/${product.slug}`} className=''>
                        <VideoPlayer url={product.reel?.video?.url} className='hidden group-hover:block transition-opacity duration-200' />
                        <Image
                            src={mediaUrlGenerator(product?.thumbnail?.url)}
                            alt={product.title}
                            width={300}
                            height={250}
                            className={`w-full h-full object-cover ${product.reel?.video.url ? "group-hover:hidden" : "group-hover:scale-110"} transition-all duration-300`}
                        />
                    </Link>
                    {product.stock && <Badge className="absolute top-2 left-2 bg-red-500 ">Sale</Badge>}

                    {
                        showAddToWishlist &&
                        <Button
                            onClick={() => handleLike(product.id)}
                            size="icon" variant="ghost"
                            className="hidden md:grid absolute cursor-pointer top-2 right-2 bg-white rounded-full place-items-center">
                            <Heart className={`h-4 w-4 ${productStore.isProductAddedToLikes(product.id) ? "text-red-500 fill-red-500" : ""}`} />
                        </Button>
                    }
                </div>
                <div className="p-4 flex flex-col gap-1">
                    <div className="">
                        <Link href={`/product/${product.slug}`}>
                            <h3 className="font-semibold text-gray-900 hover:text-gray-700 line-clamp-1 md:text-base text-xs">{product.title}</h3>
                        </Link>
                    </div>

                    <div className="flex justify-between">
                        <p className="text-sm text-gray-500">{product.brand?.name}</p>
                        <div className="flex items-center">
                            <Star className={`w-4 h-4 fill-yellow-400 text-yellow-400`}
                            />
                            <span className="text-sm text-gray-500 ml-2">{4.5}</span>
                        </div>
                    </div>

                    <div className="flex md:flex-row flex-col md:items-center gap-y-2 justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="font-bold text-gray-900">₹{product.price ?? product.product_variants[0].price}</span>
                            {product.mrp && (
                                <span className="text-sm text-gray-500 line-through">${product.mrp}</span>
                            )}
                        </div>
                        {showAddToCart && <Button size="sm" onClick={() => handleAddToCart(product)}>
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Add
                        </Button>}
                    </div>

                </div>
            </CardContent>
        </Card>
    )
}

export default ProductCard