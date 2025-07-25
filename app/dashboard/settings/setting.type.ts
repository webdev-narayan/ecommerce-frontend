import { Media } from "@/lib/types/type";

export interface StoreInfoPrivate {
    razorpay_key_secret: string,
    razorpay_key_id: string
}

export interface StoreInfoPublic {
    id: number;
    documentId: string;
    store_name: string;
    email: string;
    phone: string;
    address: string;
    description: string;

    logo?: Media;
    favicon?: Media;
}