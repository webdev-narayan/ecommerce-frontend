// types/cart.ts

import { Product, ProductVariant } from "@/app/dashboard/products/product.type"

export interface CartItem extends Product {
    cart_quantity: number;
    selected_variant: ProductVariant;
}

// Shape of cart state
export interface CartState {
    items: CartItem[];
}

// Possible action types
export type CartAction =
    | { type: "ADD_ITEM"; payload: CartItem }
    | { type: "REMOVE_ITEM"; payload: number } // id
    | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
    | { type: "CLEAR_CART" };

// Type for the context value
export interface CartContextType {
    items: CartItem[];
    addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void;
    removeItem: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}