"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CreditCard, } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

// Razorpay types
declare global {
    interface Window {
        Razorpay: any
    }
}

interface RazorpayOptions {
    key: string
    amount: number
    currency: string
    name: string
    description: string
    order_id: string
    handler: (response: any) => void
    prefill?: {
        name: string
        email: string
        contact: string
    }
    theme: {
        color: string
    }
    modal: {
        ondismiss: () => void
    }
}

export interface CreateOrderType {
    amount: number,
    amount_due: number,
    amount_paid: number,
    attempts: number,
    created_at: Date,
    currency: string,
    entity: "order",
    id: string,
    notes: [],
    offer_id: any,
    receipt: any,
    status: "created"
}

interface RazorpayCheckoutProps {
    createOrder: () => Promise<CreateOrderType | null> // Create an order using your backend logic
    verifyOrder: (paymentRes: any) => Promise<any> // Verify the order using your backend logic
    payText?: string,
    onSuccess?: (paymentData: any) => void
    onError?: (error: any) => void
    razorpayKey?: string
    onModalOpen?: () => void
}

export function RazorpayCheckout({
    createOrder,
    verifyOrder,
    payText,
    onSuccess,
    onError,
    onModalOpen,
    razorpayKey = "rzp_test_BS5XsDW435IPVf", // Replace with your actual key
}: RazorpayCheckoutProps) {
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useAuth()
    const [isScriptLoaded, setIsScriptLoaded] = useState(false)
    const { toast } = useToast()

    // Load Razorpay script
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                setIsScriptLoaded(true)
                resolve(true)
                return
            }

            const script = document.createElement("script")
            script.src = "https://checkout.razorpay.com/v1/checkout.js"
            script.onload = () => {
                setIsScriptLoaded(true)
                resolve(true)
            }
            script.onerror = () => {
                resolve(false)
            }
            document.body.appendChild(script)
        })
    }

    const handlePayment = async () => {
        setIsLoading(true)

        try {
            // Load Razorpay script
            const scriptLoaded = await loadRazorpayScript()
            if (!scriptLoaded) {
                throw new Error("Failed to load Razorpay script")
            }
            const order = await createOrder()
            if (!order) return
            const options: RazorpayOptions = {
                key: razorpayKey,
                amount: order.amount,
                currency: order.currency,
                name: "Your Store Name",
                description: `Payment for item desc item(s)`,
                order_id: order.id,
                handler: (response) => {
                    console.log(response)
                    verifyOrder(response)
                },
                theme: {
                    color: "#3B82F6",
                },
                modal: {
                    ondismiss: () => {
                        setIsLoading(false)
                        toast({
                            title: "Payment Cancelled",
                            description: "You cancelled the payment process.",
                            variant: "destructive",
                        })
                    },
                },
            }

            if (user) {
                options.prefill = {
                    name: user.name,
                    email: user.email,
                    contact: user.phone,
                }
            }

            // Open Razorpay checkout
            const rzp = new window.Razorpay(options)
            rzp.on("payment.failed", (response: any) => {
                toast
                onError?.(response.error)
            })


            rzp.open()
            onModalOpen && onModalOpen()
        } catch (error) {
            console.error("Payment error:", error)
            toast({
                title: "Error",
                description: "Failed to initiate payment. Please try again.",
                variant: "destructive",
            })
            onError?.(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button onClick={handlePayment} disabled={isLoading} className="w-full" size="lg">
            {isLoading ? (
                <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Processing...
                </>
            ) : (
                <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    {payText || "Pay Now"}
                </>
            )}
        </Button>
    )
}
