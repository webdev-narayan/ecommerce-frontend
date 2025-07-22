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

export interface Order {
    user: User
    order_id: string
    total_amount: number
    order_status: OrderStatus
    order_products: OrderProduct[]
    shipping_address: Address
    billing_address?: Address
    coupon?: Coupon
    notes: string
    order_date: Date
    deliver_date: Date
    is_shipping_billing: boolean
    customer_name: string
    customer_phone: string
    payment_status: PaymentStatus
    payment_method: PaymentMethods
    customer_email: string
}

export interface OrderProduct {
    id?: number
    documentId: string
    order: Order
    product: Product
    product_variant: ProductVariant
    quantity: number
    price: number
    total_amount: number
    createdAt?: string
    updatedAt?: string
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

export interface Address {
    id?: number
    name: string
    phone: string
    email: string
    line1: string
    line2?: string
    city: string
    state: string
    pincode: string
    country: string
    is_default: boolean
    user: User
    createdAt?: string
    updatedAt?: string
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
