import { User } from "./auth";



export interface Address {
    id: number
    documentId: string;
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
    user?: User
    createdAt?: string
    updatedAt?: string
}

export interface CreateAddress {
    documentId: string;
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
}