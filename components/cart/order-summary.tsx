"use client"

import { Separator } from "@/components/ui/separator"
import { useCoupon } from "@/contexts/coupon-context"
import { usePayment } from "@/contexts/payment-context"
import { useCart } from "@/lib/cart-context"


export function OrderSummary() {
    const { getTotalPrice } = useCart()
    const { appliedCoupon } = useCoupon()
    const { selectedPaymentGateway } = usePayment()
    const subtotal = getTotalPrice()
    const shipping = subtotal >= 500 ? 0 : 50
    // Calculate coupon discount based on type
    const calculateCouponDiscount = () => {
        if (!appliedCoupon) return 0;

        if (subtotal < appliedCoupon.min_order_amount) {
            return 0;
        }

        if (appliedCoupon.discount_type === "PERCENTAGE") {
            const percentageDiscount = (subtotal * appliedCoupon.discount_value) / 100;
            return appliedCoupon.max_discount
                ? Math.min(percentageDiscount, appliedCoupon.max_discount)
                : percentageDiscount;
        } else {
            // FLAT discount
            return Math.min(appliedCoupon.discount_value, subtotal);
        }
    };


    const couponDiscount = calculateCouponDiscount()
    const processingFee = selectedPaymentGateway?.processingFee || 0
    const tax = 0
    const total = subtotal + shipping - couponDiscount + processingFee + tax

    return (
        <div className="border-t pt-4 space-y-3">
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600" : ""}>
                        {shipping === 0 ? "Free" : `₹ ${shipping.toFixed(2)}`}
                    </span>
                </div>
                {appliedCoupon && couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                        <span>
                            Coupon Discount ({appliedCoupon.code})
                            {appliedCoupon.discount_type === "PERCENTAGE" && (
                                <span className="text-xs ml-1">({appliedCoupon.discount_value}% off)</span>
                            )}
                        </span>
                        <span>- ₹ {couponDiscount.toFixed(2)}</span>
                    </div>
                )}
                {processingFee > 0 && (
                    <div className="flex justify-between">
                        <span>Processing Fee</span>
                        <span>₹ {processingFee.toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹ {tax.toFixed(2)}</span>
                </div>
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>₹ {total.toFixed(2)}</span>
            </div>

            {subtotal < 500 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">Add ₹{(500 - subtotal).toFixed(2)} more for free shipping!</p>
                </div>
            )}
        </div>
    )
}
