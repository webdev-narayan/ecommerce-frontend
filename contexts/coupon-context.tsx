"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Coupon } from "@/app/dashboard/coupons/coupon.type"
import { getApi } from "@/lib/api"
import { toast } from "sonner"

interface CouponContextType {
  coupons: Coupon[]
  appliedCoupon: Coupon | null
  isLoading: boolean
  applyCoupon: (coupon: Coupon, orderAmount: number) => Promise<boolean>
  removeCoupon: () => void
  validateCouponForOrder: (orderAmount: number) => boolean
  refreshCoupons: () => Promise<void>
}

const CouponContext = createContext<CouponContextType | null>(null)

interface CouponProviderProps {
  children: ReactNode
}

export function CouponProvider({ children }: CouponProviderProps) {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const getCoupons = async () => {
    setIsLoading(true)
    try {
      const res = await getApi<{ data: Coupon[] }>("/coupons")
      if (res.data) {
        setCoupons(res.data.data)
      }
    } catch (error) {
      console.error("Failed to fetch coupons:", error)
      toast.error("Failed to load coupons")
    } finally {
      setIsLoading(false)
    }
  }

  const applyCoupon = async (coupon: Coupon, orderAmount: number): Promise<boolean> => {
    try {

      if (orderAmount < coupon.min_order_amount) {
        toast.error(`Minimum order amount of ₹${coupon.min_order_amount} required for this coupon`)
        return false
      }
      setAppliedCoupon(coupon)
      toast.success(`Coupon ${coupon.code} applied successfully!`)
      return true
    } catch (error) {
      console.error("Error applying coupon:", error)
      toast.error("Failed to apply coupon")
      return false
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    toast.success("Coupon removed")
  }

  const validateCouponForOrder = (orderAmount: number): boolean => {
    if (!appliedCoupon) return true
    return orderAmount >= appliedCoupon.min_order_amount
  }

  const refreshCoupons = async () => {
    await getCoupons()
  }

  // Load coupons on mount
  useEffect(() => {
    getCoupons()
  }, [])

  // Load applied coupon from localStorage on mount
  useEffect(() => {
    const savedCoupon = localStorage.getItem("appliedCoupon")
    if (savedCoupon) {
      try {
        const coupon = JSON.parse(savedCoupon) as Coupon
        // Validate the saved coupon is still valid
        if (coupon.is_active && new Date(coupon.expires_at) > new Date()) {
          setAppliedCoupon(coupon)
        } else {
          localStorage.removeItem("appliedCoupon")
        }
      } catch (error) {
        console.error("Failed to parse saved coupon:", error)
        localStorage.removeItem("appliedCoupon")
      }
    }
  }, [])

  // Save applied coupon to localStorage
  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem("appliedCoupon", JSON.stringify(appliedCoupon))
    } else {
      localStorage.removeItem("appliedCoupon")
    }
  }, [appliedCoupon])

  return (
    <CouponContext.Provider
      value={{
        coupons,
        appliedCoupon,
        isLoading,
        applyCoupon,
        removeCoupon,
        validateCouponForOrder,
        refreshCoupons,
      }}
    >
      {children}
    </CouponContext.Provider>
  )
}

export function useCoupon(): CouponContextType {
  const context = useContext(CouponContext)
  if (!context) {
    throw new Error("useCoupon must be used within a CouponProvider")
  }
  return context
}
