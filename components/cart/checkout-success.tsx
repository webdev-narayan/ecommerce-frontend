"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CheckoutSuccessProps {
    orderData: any
    onClose: () => void
}

export function CheckoutSuccess({ orderData, onClose }: CheckoutSuccessProps) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Check className="h-8 w-8 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>

            <p className="text-gray-600 mb-6">
                Thank you for your purchase. Your order has been confirmed and will be delivered soon.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 w-full">
                <div className="text-sm text-gray-600 mb-1">Order ID</div>
                <div className="font-mono font-medium">{orderData?.orderId}</div>
            </div>

            <div className="space-y-3 w-full">
                <Button className="w-full">Track Your Order</Button>
                <Button variant="outline" className="w-full bg-transparent" onClick={onClose}>
                    Continue Shopping
                </Button>
            </div>

            <p className="text-xs text-gray-500 mt-6">
                You will receive an email confirmation shortly with your order details.
            </p>
        </div>
    )
}
