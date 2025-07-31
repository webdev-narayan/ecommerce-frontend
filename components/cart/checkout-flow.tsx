"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { AddressSelection } from "./address-selection"
import { PaymentSelection } from "./payment-selection"
import { OrderSummary } from "./order-summary"
import { CreateOrderType, RazorpayCheckout } from "../checkout"
import { postApi } from "@/lib/api"
import { useCoupon } from "@/contexts/coupon-context"
import { usePayment } from "@/contexts/payment-context"
import { useAddress } from "@/contexts/address-context"

interface CheckoutFlowProps {
    onSuccess: (orderData: any) => void
    onBack: () => void
    handleClose: () => void
}

interface CheckoutPayload {
    product_variants: { id: number, quantity: number }[],
    address_id: number,
    payment_method: "PREPAID" | "COD",
    coupon_code?: string;
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
}

export function CheckoutFlow({ onSuccess, onBack, handleClose }: CheckoutFlowProps) {
    const [isProcessing, setIsProcessing] = useState(false)
    const { clearCart, getTotalPrice, getTotalItems, items } = useCart()
    const { appliedCoupon } = useCoupon()
    const { selectedPaymentGateway } = usePayment()
    const { selectedAddress } = useAddress()

    const handlePlaceOrder = async (): Promise<CreateOrderType | null> => {
        setIsProcessing(true)
        console.log(items)
        const payload: CheckoutPayload = {
            address_id: Number(selectedAddress),
            product_variants: items.map((item) => {
                return {
                    id: item.selected_variant.id,
                    quantity: item.cart_quantity,
                }
            }),
            payment_method: selectedPaymentGateway?.id as "PREPAID" | "COD",
            ...(appliedCoupon && { coupon_code: appliedCoupon.code }),
        }
        const res = await postApi<CreateOrderType>("/orders/checkout", payload, true)
        clearCart()
        onSuccess("")
        setIsProcessing(false)
        return res.data || null
    }

    const handleVerifyOrder = async (orderData: CreateOrderType) => {
        const res = await postApi<{ success: boolean }>("/orders/verify", orderData, true)
        if (res.data?.success) {
            console.log(res.data)
        } else {
            console.log("payment failed")
        }
    }

    return (
        <div className="space-y-6 relative">
            {/* Back Button */}
            <Button variant="ghost" size="sm" onClick={onBack} className="p-0 px-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cart
            </Button>

            {/* Address Selection */}
            <AddressSelection />

            {/* Payment Selection */}
            <PaymentSelection />

            <div className="space-y-6">
                {/* Order Summary */}
                <OrderSummary />

                {/* Place Order Button */}
                {/* <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={isProcessing}>
                    {isProcessing ? "Processing..." : "Place Order"}
                </Button> */}
                <RazorpayCheckout
                    createOrder={handlePlaceOrder}
                    verifyOrder={handleVerifyOrder}
                    onModalOpen={handleClose}
                />
            </div>
        </div>
    )
}
