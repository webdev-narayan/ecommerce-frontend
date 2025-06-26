import { Media } from "@/lib/types/type";
import { Category } from "@/app/dashboard/categories/categories.type";
import { VariantOption } from "./attributes/attribute.type";

export interface Product {
    id: number;
    documentId: string;
    title: string;
    description: string;
    price: number;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    status: string;
    stock: number;
    category: Category;
    brand: string;
    thumbnail: Media;
    gallery: Media[];
    product_variants: ProductVariant[]
}

export interface ProductVariant {
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