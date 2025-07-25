
export interface Media {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string;
    caption: string;
    width: number;
    height: number;
    formats: {
        thumbnail: {
            url: string;
            alt: string
        };
    };
    alt: string
    url: string;
}

export interface MetaResponse {
    pagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
    };
}

export enum BannerPlacement {
    GENERAL = "GENERAL",
    HOME_TOP = "HOME_TOP",
    HOME_MID = "HOME_MID",
    HOME_FOOT = "HOME_FOOT",
    CATEGORY = "CATEGORY",
    PRODUCT = "PRODUCT",
    BRAND = "BRAND",
    CART = "CART",
    COLLECTION = "COLLECTION",
}


export interface User {
    id: number
    documentId: string
    username: string
    confirmed: boolean
    blocked: boolean
    name: string
    phone: string
    email: string
    avatar?: string
}




export interface Product {
    id?: number
    documentId?: string
    title: string
    slug: string
    description: string
    price: string
    thumbnail?: Media
    gallery?: Media[]
    is_featured: boolean
    category: { id: number; name?: string }
    brand: { id: number; name?: string }
}

export interface ProductVariant {
    id?: number
    sku: string
    price: number
    quantity: number
    mrp: string
    gallery?: Media[]
    thumbnail?: Media
    product: Product
}



export interface Coupon {
    id: number
    code: string
    discount: number
}

export enum PaymentStatus {
    PAID = "PAID",
    UNPAID = "UNPAID",
    REFUNDED = "REFUNDED",
}

export enum PaymentMethods {
    PREPAID = "PREPAID",
    COD = "COD",
}

export enum OrderStatus {
    NEW = "NEW",
    ACCEPTED = "ACCEPTED",
    CANCELLED = "CANCELLED",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
}
