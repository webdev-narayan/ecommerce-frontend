import { Media } from "@/lib/types/type";
import { Category } from "@/app/dashboard/categories/categories.type";
import { VariantOption } from "./attributes/attribute.type";
import { Brand } from "../brands/brand.type";
import { User } from "@/lib/types/auth";
import { Reel } from "../reels/reel.type";

export interface Product {
    id: number;
    documentId: string;
    slug: string;
    title: string;
    description: string;
    description_rich_text: string;
    price: number;
    mrp: number;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    status: string;
    stock: number;
    category?: Category;
    brand?: Brand;
    thumbnail?: Media;
    gallery?: Media[];
    product_variants: ProductVariant[];
    review_count?: number;
    reviews?: Review[]
    reel?: Reel
    review_meta: {
        count: number,
        rating: number
    }
}

export interface Review {
    id: number;
    documentId: string;
    comment: string;
    rating: number;
    images?: Media[];
    user?: User;

    createdAt: string;
    updatedAt: string;

}

export interface ProductVariant {
    id: number;
    documentId: string;
    sku: string;
    price: number;
    mrp: number;
    quantity: number;
    thumbnail?: Media;
    gallery?: Media[];
    variant_options?: VariantOption[]
}

export interface Gender {
    id: number;
    documentId: string;
    name: string
}