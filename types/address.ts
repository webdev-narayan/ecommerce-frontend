export interface Address {
    id: number;
    name: string;
    phone: string;
    email: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    is_default: boolean;
}