"use client"

import { useState } from "react"
import { Check, Copy, Tag, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCart } from "@/lib/cart-context"
import { useCoupon } from "@/contexts/coupon-context"
import { toast } from "sonner"
import { Badge } from "../ui/badge"
import CouponApplied from "./coupon-applied"


export function CouponSection() {
  const [couponCode, setCouponCode] = useState("")
  const [showCouponsDialog, setShowCouponsDialog] = useState(false)
  const { appliedCoupon, applyCoupon, removeCoupon, coupons } = useCoupon()
  const { getTotalPrice } = useCart()

  const handleApplyCoupon = (code?: string) => {
    const couponToApply = code || couponCode
    const coupon = coupons.find((c) => c.code === couponToApply)

    if (coupon && getTotalPrice() <= coupon.min_order_amount) {
      toast.error(`Coupon ${couponCode} requires a minimum purchase of ₹ ${coupon.min_order_amount}.`)
      return
    }

    if (coupon) {
      applyCoupon(coupon, getTotalPrice())
      setCouponCode("")
      setShowCouponsDialog(false)
    }
  }

  const handleCopyCouponCode = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode)
  }

  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2">
        <Tag className="h-4 w-4" />
        Coupon Code
      </Label>


      {appliedCoupon ? (
        // <div className="flex items-center justify-between p-2 py-1 bg-green-50 border border-dashed border-green-200 rounded-lg">
        //   <div className="flex items-center gap-2">
        //     <Check className="h-4 w-4 text-green-600" />
        //     <span className="text-sm font-medium text-green-800 bg-green-200 rounded-full px-2 py-0.5">{appliedCoupon.code}</span>
        //     <span className="text-sm font-medium text-green-800">
        //       Applied Successfuly
        //     </span>
        //   </div>
        //   <Button variant="ghost" size="sm" onClick={removeCoupon} className="text-green-600 hover:text-green-800 cursor-pointer">
        //     <X className="h-4 w-4" />
        //   </Button>
        // </div>
        <CouponApplied coupon={appliedCoupon} removeCoupon={removeCoupon} />
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
                  className={`p-2 border border-dashed  rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors ${getTotalPrice() >= coupon.min_order_amount ? "bg-green-50 border-green-300" : "bg-gray-50 border-red-300"}`}
                  onClick={() => handleApplyCoupon(coupon.code)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-blue-600 bg-blue-50  text-sm px-2 py-1 border-blue-400 border rounded-md flex items-center border-dashed">{coupon.code} <Copy onClick={() => handleCopyCouponCode(coupon.code)} className="size-4 ml-2" /></span>
                    <span className="font-semibold text-green-600 bg-green-50 border-green-400 border text-xs p-1 rounded-full px-2">{coupon.discount_type === "FLAT" && "₹"} {coupon.discount_value}{coupon.discount_type === "PERCENTAGE" && "%"} OFF</span>
                  </div>
                  <p className="text-xs text-gray-600">{getTotalPrice() >= coupon.min_order_amount ? "Applicable" : `Add more items worth: ₹${coupon.min_order_amount - getTotalPrice()}`}</p>
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
