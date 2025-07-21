"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { AddressSelection } from "./address-selection"
import { PaymentSelection } from "./payment-selection"
import { OrderSummary } from "./order-summary"

interface CheckoutFlowProps {
    onSuccess: (orderData: any) => void
    onBack: () => void
}

export function CheckoutFlow({ onSuccess, onBack }: CheckoutFlowProps) {
    const [isProcessing, setIsProcessing] = useState(false)
    const { clearCart } = useCart()

    const handlePlaceOrder = async () => {
        setIsProcessing(true)

        // Simulate order processing
        await new Promise((resolve) => setTimeout(resolve, 2000))

        const orderData = {
            orderId: `ORD-${Date.now()}`,
            timestamp: new Date().toISOString(),
        }

        clearCart()
        onSuccess(orderData)
        setIsProcessing(false)
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
                <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={isProcessing}>
                    {isProcessing ? "Processing..." : "Place Order"}
                </Button>
            </div>
        </div>
    )
}
