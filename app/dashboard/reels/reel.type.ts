import { Media } from "@/lib/types/type"
import { Product } from "../products/product.type"

export interface Reel {
    id: number
    documentId: string
    title: string
    video: Media,
    products?: Product[]
    is_active: boolean
}

export interface CreateReel {
    title: string;
    video: number | null
    products: number[]
    is_active: boolean
}