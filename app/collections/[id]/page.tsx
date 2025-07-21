"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getApi } from "@/lib/api";
import ProductCard from "@/components/product-card";
import { LoadingShoppingCart } from "@/components/loaders";
import { Product } from "@/app/dashboard/products/product.type";

// Types
type Collection = {
    id: number;
    name: string;
    slug: string;
    bannerUrl: string;
    description?: string;
    products: Product[];
};

export default function CollectionPage() {
    const { id: collectionId } = useParams();
    const [collection, setCollection] = useState<Collection | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);

    async function fetchCollection() {
        const res = await getApi<{ data: Collection }>(`/collections/${collectionId}?populate=thumbnail`); // Adjust API/path as needed
        console.log("sdf")
        setCollection(res.data?.data || null);
    }
    async function fetchProducts() {
        const res = await getApi<{ data: Product[] }>(`/products?filters[collections][documentId][$eq]=${collectionId}&populate=product_variants`); // Adjust API/path as needed
        setProducts(res.data?.data || []);
    }
    useEffect(() => {
        setIsLoading(true);
        if (collectionId) {
            fetchCollection()
            fetchProducts();
        };
        setIsLoading(false);
    }, [collectionId]);

    if (isLoading) {
        return (
            <div className="w-full h-[500px] flex flex-col justify-center items-center">
                <LoadingShoppingCart />
                <h5>Loading collection...</h5>
            </div>
        );
    }

    if (!collection) {
        return <div className="text-center text-gray-500 py-12">Collection not found.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Banner */}
            <div
                className="w-full h-64 md:h-96 bg-center bg-cover flex items-center justify-center"
                style={{
                    backgroundImage: `url(${collection.bannerUrl})`
                }}
            >
                <div className="bg-black bg-opacity-50 p-8 rounded-lg text-center">
                    <h1 className="text-4xl md:text-5xl text-white font-bold">{collection.name}</h1>
                    {collection.description && <p className="text-white mt-2">{collection.description}</p>}
                </div>
            </div>
            {/* Products */}
            <div className="container mx-auto px-4 py-10">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                    Showing {products.length} products in this collection
                </h2>
                {products.length === 0 ? (
                    <p className="text-lg text-gray-500">No products found.</p>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                showAddToWishlist={true}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
