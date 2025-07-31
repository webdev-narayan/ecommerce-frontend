import { User } from "@/lib/types/auth";
import { Media } from "@/lib/types/type";
import { Product } from "../products/product.type";

export interface Review {
    id: number;
    documentId: string;
    user: User;
    rating: number;
    comment: string;
    images: Media[]
    approved: boolean;
    product?: Product
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateReview {
    user?: number;
    rating: number;
    comment: string;
    images?: number[] | null;
    product?: number;
    approved?: boolean;
}