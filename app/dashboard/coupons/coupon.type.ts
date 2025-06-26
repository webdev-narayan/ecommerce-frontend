
export interface Coupon {
    id: number;
    documentId: string;
    code: string;
    discount_type: "FLAT" | "PERCENTAGE";
    discount_value: number;
    min_order_value: number;
    max_discount: number;
    expires_at: Date;
    is_active: boolean;
    usage_limit: number;
    usage_count: number;
    createdAt: string;
    updatedAt: string;
}