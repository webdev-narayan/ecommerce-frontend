import { Media } from "@/lib/types/type";

export interface Brand {
    id: number;
    name: string;
    documentId: string;
    thumbnail?: Media;
    createdAt: string;
    updatedAt: string;
    products?: {
        count:
        number
    }
}