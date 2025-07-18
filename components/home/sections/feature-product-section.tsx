import { Product } from '@/app/dashboard/products/product.type'
import ProductCard from '@/components/product-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getApi } from '@/lib/api'
import { mediaUrlGenerator } from '@/lib/utils'
import { ArrowRight, Heart, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const FeatureProductSection = () => {
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        async function getProducts() {
            let query = new URLSearchParams()
            query.append("pagination[page]", "1")
            query.append("pagination[pageSize]", "8")
            query.append("populate[0]", "category")
            query.append("populate[1]", "thumbnail")
            query.append("populate[2]", "brand")
            query.append("populate[3]", "product_variants")
            const res = await getApi<{ data: Product[] }>(`/products?${query.toString()}`)
            if (res.data) {
                setProducts(res.data.data)
            }
        }
        getProducts()
    }, [])

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
                    <p className="text-gray-600">Handpicked products just for you</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 md:gap-6 gap-3">
                    {products.map((product, index) => (
                        // <Card
                        //     key={index} className="group cursor-pointer hover:shadow-lg transition-shadow">
                        //     <Link href={`/product/${product.slug}`}>

                        //         <CardContent className="p-0">
                        //             <div className="relative overflow-hidden rounded-t-lg">
                        //                 <Image
                        //                     src={mediaUrlGenerator(product.thumbnail?.url)}
                        //                     alt={product.title}
                        //                     width={300}
                        //                     height={350}
                        //                     className="w-full md:h-[350px] object-top object-cover group-hover:scale-105 transition-transform duration-300"
                        //                 />
                        //                 <Button size="icon" variant="ghost" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
                        //                     <Heart className="md:h-4 md:w-4 w-2 h-2" />
                        //                 </Button>
                        //                 {product.product_variants[0]?.price && <Badge className="absolute top-2 left-2 bg-red-500">Sale</Badge>}
                        //             </div>
                        //             <div className="p-4">
                        //                 <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{product.title}</h3>
                        //                 <div className="flex items-center mb-2">
                        //                     <div className="flex items-center">
                        //                         {[...Array(5)].map((_, i) => (
                        //                             <Star
                        //                                 key={i}
                        //                                 className={`md:h-4 md:w-4 w-3 h-3 ${i < Math.floor(5) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        //                             />
                        //                         ))}
                        //                     </div>
                        //                     <span className="text-sm text-gray-500 ml-2">(3.4)</span>
                        //                 </div>
                        //                 <div className="flex items-center space-x-2">
                        //                     <span className="font-bold text-gray-900">₹ {product.price || product.product_variants[0].price}</span>
                        //                     {product.mrp && (
                        //                         <span className="text-sm text-gray-500 line-through">{product.price || product.product_variants[0].price}</span>
                        //                     )}
                        //                 </div>
                        //             </div>
                        //         </CardContent>
                        //     </Link>
                        // </Card>
                        <ProductCard key={product.documentId} product={product} />
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Button variant="outline" size="lg">
                        View All Products
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default FeatureProductSection