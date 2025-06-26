export interface VariantOption {
    id: number;
    documentId: string;
    name: string;
    property?: string | null;
    variant_attribute: VariantAttribute
}

export interface VariantAttribute {
    id: number;
    documentId: string;
    name: string;
    variant_options: VariantOption[]
}