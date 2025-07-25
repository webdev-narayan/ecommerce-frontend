"use client"

import { Plus, Minus, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { mediaUrlGenerator } from "@/lib/utils"
import { CouponSection } from "./coupon-section"
import { OrderSummary } from "./order-summary"
import { useAuth } from "@/contexts/auth-context"
import { redirect } from "next/navigation"

interface CartItemsProps {
    onProceedToCheckout: () => void
    onClose: () => void
}

export function CartItems({ onProceedToCheckout, onClose }: CartItemsProps) {
    const { items, updateQuantity, removeItem } = useCart()
    const { isAuthenticated } = useAuth()

    const handleQuantityChange = (id: number, variant_id: number, newQuantity: number) => {
        // console.log(id, variant_id, newQuantity)
        updateQuantity(id, variant_id, newQuantity)
        if (newQuantity === 0) {
            toast.success("Item removed from cart")
        }
    }

    const handleRemoveItem = (id: number, variant_id: number, title: string) => {
        // console.log(id, variant_id, title)
        // return
        removeItem(id, variant_id)
        toast.success(`${title} removed from cart`)
    }

    return (
        <div className="space-y-6">
            {/* Cart Items List */}
            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.id + item.selected_variant.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="relative w-14 h-14 flex-shrink-0">
                            <Image
                                src={
                                    mediaUrlGenerator(
                                        item.selected_variant?.thumbnail?.url || item.thumbnail?.url || "/placeholder-product.jpg",
                                    ) || "/placeholder.svg"
                                }
                                alt={item.title}
                                width={56}
                                height={56}
                                className="w-full h-full object-cover object-top rounded-md"
                            />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">{item.title}</h4>
                            {item.brand && <p className="text-sm text-gray-500">{item.brand.name}</p>}
                            <p className="text-sm font-semibold text-gray-900">₹ {item.selected_variant?.price || item.price}</p>
                        </div>

                        <div className="flex items-center gap-1">
                            <Button variant="outline" size="sm" onClick={() => handleQuantityChange(item.id, item.selected_variant.id, item.cart_quantity - 1)}>
                                <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.cart_quantity}</span>
                            <Button variant="outline" size="sm" onClick={() => handleQuantityChange(item.id, item.selected_variant.id, item.cart_quantity + 1)}>
                                <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(item.id, item.selected_variant.id, item.title)}
                                className="text-red-500 hover:text-red-700 ml-1"
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Coupon Section */}
            <CouponSection />

            {/* Order Summary */}
            <OrderSummary />

            {/* Action Buttons */}
            <div className="space-y-2">
                {
                    isAuthenticated ?
                        < Button className="w-full" size="lg" onClick={onProceedToCheckout}>
                            Checkout
                        </Button>
                        : <Button size="lg" className="w-full" onClick={() => {
                            onClose()
                            redirect("/login")
                        }}>
                            Sign In to Checkout
                        </Button>
                }
                <Link href="/shop" className="w-full">
                    <Button variant="outline" className="w-full bg-transparent" onClick={onClose}>
                        Continue Shopping
                    </Button>
                </Link>
            </div>
        </div >
    )
}
