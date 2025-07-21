"use client"

import { Coupon } from "@/app/dashboard/coupons/coupon.type"
import { getApi } from "@/lib/api"
import { useEffect, useState } from "react"


export function useCoupon() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)

  const getCoupons = async () => {
    const res = await getApi<{ data: Coupon[] }>("/coupons")
    if (res.data) {
      setCoupons(res.data.data)
    }
  }

  const applyCoupon = (coupon: Coupon) => {
    setAppliedCoupon(coupon)
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
  }

  useEffect(() => {
    getCoupons()
  }, [])
  return {
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    coupons
  }
}
