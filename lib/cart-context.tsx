
"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
// import { CartState, CartAction, CartContextType, CartItem } from "@/types/cart";
import { CartState, CartAction, CartContextType, CartItem } from "./types/cart";
import { Product, ProductVariant } from "@/app/dashboard/products/product.type";

// Create context with a default value (will never be used, due to Provider)
const CartContext = createContext<CartContextType | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case "ADD_ITEM":
            const existingItem = state.items.find(
                (item) => item.id === action.payload.id && item.selected_variant.id === action.payload.selected_variant.id
            );

            if (existingItem) {
                return {
                    ...state,
                    items: state.items.map((item) =>
                        item.id === action.payload.id
                            ? {
                                ...item,
                                cart_quantity: item.cart_quantity + action.payload.cart_quantity,
                            }
                            : item
                    ),
                };
            }

            return {
                ...state,
                items: [...state.items, action.payload],
            };

        case "REMOVE_ITEM":
            return {
                ...state,
                items: state.items.filter((item) => !(item.id === action.payload.id && item.selected_variant.id === action.payload.variant_id)),
            };

        case "UPDATE_QUANTITY":
            return {
                ...state,
                items: state.items.map((item) =>
                    item.id === action.payload.id && item.selected_variant.id === action.payload.variant_id
                        ? { ...item, cart_quantity: action.payload.quantity }
                        : item
                ),
            };

        case "CLEAR_CART":
            return {
                ...state,
                items: [],
            };

        default:
            return state;
    }
};

type CartProviderProps = {
    children: ReactNode;
};

// Helper to validate localStorage data (optional but recommended)
function isValidCartItem(item: any): item is CartItem {
    return (
        item &&
        typeof item.id === "number" &&
        typeof item.cart_quantity === "number" &&
        item.selected_variant &&
        typeof item.selected_variant.id === "number"
    );
}

export function CartProvider({ children }: CartProviderProps) {
    const [state, dispatch] = useReducer(cartReducer, { items: [] });

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                const cartData: CartState = JSON.parse(savedCart);
                if (Array.isArray(cartData.items)) {
                    // Only dispatch valid items
                    cartData.items.forEach((item) => {
                        if (isValidCartItem(item)) {
                            dispatch({ type: "ADD_ITEM", payload: item });
                        }
                    });
                }
            } catch (e) {
                console.error("Failed to parse cart from localStorage", e);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(state));
    }, [state]);

    const addItem = (product: Product, quantity: number = 1, variant?: ProductVariant) => {
        if (!variant) {
            variant = product.product_variants[0]; // or throw/log error if needed
        }
        if (!variant) {
            throw new Error('Product has no variants and none was provided.');
        }
        dispatch({
            type: "ADD_ITEM",
            payload: {
                ...product,
                cart_quantity: quantity,
                selected_variant: variant,
            },
        });
    };

    const removeItem = (id: number, variant_id: number) => {
        dispatch({ type: "REMOVE_ITEM", payload: { id, variant_id } });
    };

    const updateQuantity = (id: number, variant_id: number, quantity: number) => {
        if (quantity <= 0) {
            removeItem(id, variant_id);
        } else {
            dispatch({ type: "UPDATE_QUANTITY", payload: { id, variant_id, quantity } });
        }
    };

    const clearCart = () => {
        dispatch({ type: "CLEAR_CART" });
    };

    const getTotalItems = (): number => {
        return state.items.reduce((total, item) => total + item.cart_quantity, 0);
    };

    const getTotalPrice = (): number => {
        return state.items.reduce(
            (total, item) => total + (item.selected_variant?.price || item.price) * item.cart_quantity,
            0
        );
    };

    return (
        <CartContext.Provider
            value={{
                items: state.items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                getTotalItems,
                getTotalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

// Custom hook with type safety
export function useCart(): CartContextType {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
