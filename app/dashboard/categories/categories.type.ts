import {Media} from "@/lib/types/type";

export interface Category {
    id: number;
    name: string;
    description: string;
    documentId: string
    productsCount?: number
    thumbnail?: Media
}

export interface CategoryForm {
    name: string;
    description: string;
    
}