import { Collection } from '@/app/dashboard/collections/collection.type'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getApi } from '@/lib/api'
import { mediaUrlGenerator } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const CollectionSection = () => {
    const [collections, setCollections] = useState<Collection[]>([])

    useEffect(() => {
        async function getCollections() {
            const res = await getApi<{ data: Collection[] }>("/collections?pagination[page]=1&pagination[pageSize]=6&populate=thumbnail")
            if (res.data) {
                setCollections(res.data.data)
            }
        }
        getCollections()
    }, [])

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Collections</h2>
                    <p className="text-gray-600">Curated collections for every style and occasion</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {collections.map((collection, index) => (
                        <Card key={index} className="group cursor-pointer hover:shadow-lg transition-shadow overflow-hidden">
                            <CardContent className="p-0">
                                <div className="relative">
                                    <Image
                                        src={mediaUrlGenerator(collection.thumbnail.url)}
                                        alt={collection.title}
                                        width={400}
                                        height={300}
                                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                                    <div className="absolute inset-0 flex justify-end items-end px-6 pb-2">
                                        <div className="text-center text-white">
                                            <h3 className="text-2xl font-bold mb-2">{collection.title}</h3>
                                            <div>
                                                <Button variant="outline" className="text-white border-none bg-transparent hover:bg-transparent cursor-pointer hover:text-white group">
                                                    Explore <ArrowRight className='group-hover:translate-x-2 transition-transform duration-200' />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default CollectionSection