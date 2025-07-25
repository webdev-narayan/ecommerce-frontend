import { Tag, X } from 'lucide-react'
import React from 'react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Coupon } from '@/app/dashboard/coupons/coupon.type';
import { useCoupon } from '@/contexts/coupon-context';
import { useCart } from '@/lib/cart-context';

interface CouponAppliedProps {
    coupon: Coupon;
    removeCoupon: () => void; // Function to remove the coupon from the cart state.
}

const CouponApplied = ({ coupon, removeCoupon }: CouponAppliedProps) => {

    const { } = useCoupon();
    const { getTotalPrice } = useCart()
    const subtotal = getTotalPrice()

    const calculateCouponDiscount = () => {
        if (!coupon) return 0;

        if (subtotal < coupon.min_order_amount) {
            return 0;
        }

        if (coupon.discount_type === "PERCENTAGE") {
            const percentageDiscount = (subtotal * coupon.discount_value) / 100;
            return coupon.max_discount
                ? Math.min(percentageDiscount, coupon.max_discount)
                : percentageDiscount;
        } else {
            // FLAT discount
            return Math.min(coupon.discount_value, subtotal);
        }
    };

    const couponDiscount = calculateCouponDiscount()


    return (
        <div className="flex items-center justify-between p-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Tag className="w-4 h-4 text-green-600" />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{coupon.code}</Badge>
                        <span className="text-sm font-medium text-green-700">{coupon.discount_type === "FLAT" && "₹"} {coupon.discount_value} {coupon.discount_type === "PERCENTAGE" && "%"} off applied!</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">You saved ₹ {couponDiscount}</p>
                </div>
            </div>
            <Button
                variant="ghost"
                size="sm"
                onClick={removeCoupon}
                className="text-green-700 hover:text-green-800 hover:bg-green-100 h-8 w-8 p-0"
            >
                <X className="w-4 h-4" />
            </Button>
        </div>
    )
}

export default CouponApplied