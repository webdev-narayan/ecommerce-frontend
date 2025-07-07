import { Media } from "@/lib/types/type"

export interface Banner {
    id: number
    documentId: string
    title: string
    link_url: string;
    description: string
    image: Media
    mobile_image: Media
    order: number
    is_active: boolean
}