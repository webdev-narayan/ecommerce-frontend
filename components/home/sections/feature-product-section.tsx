import { Product } from '@/app/dashboard/products/product.type'
import ProductCard from '@/components/cards/product-card'
import { Button } from '@/components/ui/button'
import { getApi } from '@/lib/api'
import { ArrowRight, } from 'lucide-react'
import { redirect } from 'next/navigation'
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
            query.append("populate[4]", "reel")
            query.append("populate[5]", "reel.video")
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
                    {products.map((product) => (
                        <ProductCard key={product.documentId} product={product} />
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Button onClick={() => redirect("/shop")} variant="outline" size="lg">
                        View All Products
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default FeatureProductSection