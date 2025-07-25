import { Address } from "@/lib/types/address";
import { Product, ProductVariant } from "../products/product.type";
import { User } from "@/lib/types/auth";
import { PaymentMethods } from "@/lib/types/type";
import { Coupon } from "../coupons/coupon.type";

export interface Order {
    id: number;
    documentId: string;
    user: User
    order_id: string;
    total_amount: number;
    subtotal_amount: number;
    discount: number;
    order_status: OrderStatus;
    order_products: OrderProduct[];
    shipping_address: Address;
    billing_address?: Address;
    is_shipping_billing: boolean;
    coupon: Coupon;
    notes: string;
    order_date: Date;
    deliver_date: Date;
    transactions: string[];

    customer_name: string;
    customer_email: string;
    customer_phone: string;

    payment_status: PaymentStatus;
    payment_method: PaymentMethods;
    payment_gateway: "RAZORPAY";

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
