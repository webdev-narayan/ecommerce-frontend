"use client"

import { useState } from "react"
import { Check, Tag, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCoupon } from "@/hooks/use-coupon"


export function CouponSection() {
  const [couponCode, setCouponCode] = useState("")
  const [showCouponsDialog, setShowCouponsDialog] = useState(false)
  const { appliedCoupon, applyCoupon, removeCoupon, coupons } = useCoupon()

  const handleApplyCoupon = (code?: string) => {
    const couponToApply = code || couponCode
    const coupon = coupons.find((c) => c.code === couponToApply)

    if (coupon) {
      applyCoupon(coupon)
      setCouponCode("")
      setShowCouponsDialog(false)
    }
  }

  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2">
        <Tag className="h-4 w-4" />
        Coupon Code
      </Label>

      {appliedCoupon ? (
        <div className="flex items-center justify-between p-2 py-1 bg-green-50 border border-dashed border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">{appliedCoupon.code}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={removeCoupon} className="text-green-600 hover:text-green-800 cursor-pointer">
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="">
          <div className="flex gap-2">
            <Input
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="border-dashed"
            />
            <Button variant="outline" onClick={() => handleApplyCoupon()}>
              Apply
            </Button>
          </div>

          <button onClick={() => setShowCouponsDialog(!showCouponsDialog)} className="text-blue-600 text-xs cursor-pointer">{showCouponsDialog ? "Close All" : "View All"}</button>

          {
            showCouponsDialog &&
            <div className="space-y-3 mt-2">
              {coupons.map((coupon) => (
                <div
                  key={coupon.code}
                  className="p-3 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  onClick={() => handleApplyCoupon(coupon.code)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-blue-600">{coupon.code}</span>
                    <span className="text-sm font-semibold text-green-600">{coupon.discount_type === "FLAT" && "₹"} {coupon.discount_value}{coupon.discount_type === "PERCENTAGE" && "%"} OFF</span>
                  </div>
                  <p className="text-xs text-gray-600">{coupon.discount_type}</p>
                  <p className="text-xs text-gray-500 mt-1">Min order value:  ₹{coupon.min_order_amount}</p>
                </div>
              ))}
            </div>
          }

        </div>
      )}
    </div>
  )
}
