
export interface Coupon {
    id: number;
    documentId: string;
    code: string;
    discount_type: "FLAT" | "PERCENTAGE";
    discount_value: number;
    min_order_amount: number;
    max_discount: number;
    expires_at: string;
    is_active: boolean;
    usage_limit: number;
    usage_count: number;
    createdAt?: Date;
    updatedAt?: Date;
}