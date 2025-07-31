import { Media } from "@/lib/types/type"

export interface Collection {
    id: number
    documentId: string
    title: string
    description: string
    cover_image: Media
    thumbnail: Media
    productCount: number
    is_active: boolean
    startDate: string
    endDate: string
    createdAt: string
    updatedAt: string
    products?: {
        count:
        number
    }
}