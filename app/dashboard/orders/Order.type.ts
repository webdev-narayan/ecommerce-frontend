import { Product, ProductVariant } from "../products/product.type";

export interface Order {
    id: number;
    documentId: string;
    user: User
    order_id: string;
    total_amount: number;
    order_status: OrderStatus;
    order_products: OrderProduct[];
    shipping_address: Address;
    billing_address: Address;
    is_shipping_billing: boolean;
    coupon: string;
    notes: string;
    order_date: Date;
    deliver_date: Date;
    transactions: string[];

    customer_name: string;
    customer_email: string;
    customer_phone: string;

    payment_status: PaymentStatus;

    createdAt: string;
    updatedAt: string;
}

export interface OrderProduct {
    id: number;
    documentId: string;
    product: Product;
    product_variant: ProductVariant;
    quantity: number;
    price: number;
    total_amount: number;
}

export enum OrderStatus {
    NEW = "NEW",
    ACCEPTED = "ACCEPTED",
    CANCELLED = "CANCELLED",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
}

export enum PaymentStatus {
    PAID = "PAID",
    UNPAID = "UNPAID",
    REFUNDED = "REFUNDED",
}

interface User {
    id: number;
    documentId: string;
    name: string;
    email: string;
    role: string;
}

interface Address {
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}