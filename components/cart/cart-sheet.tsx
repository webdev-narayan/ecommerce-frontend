
"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/lib/cart-context"
import { CartItems } from "./cart-items"
import { CheckoutFlow } from "./checkout-flow"
import { CheckoutSuccess } from "./checkout-success"
import { CouponProvider } from "@/contexts/coupon-context"
import { PaymentProvider } from "@/contexts/payment-context"
import { AddressProvider } from "@/contexts/address-context"

type CheckoutStep = "cart" | "checkout" | "success"

export function CartSheet() {
  const { items, getTotalItems } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("cart")
  const [orderData, setOrderData] = useState<any>(null)

  const handleStepChange = (step: CheckoutStep, data?: any) => {
    setCurrentStep(step)
    if (data) {
      setOrderData(data)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setCurrentStep("cart")
    setOrderData(null)
  }

  const getSheetTitle = () => {
    switch (currentStep) {
      case "cart":
        return `Shopping Cart (${getTotalItems()} items)`
      case "checkout":
        return "Checkout"
      default:
        return "Shopping Cart"
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-gray-900">
            {getTotalItems()}
          </Badge>
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left">{getSheetTitle()}</SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Add some products to get started</p>
              <Link href="/shop">
                <Button onClick={handleClose}>Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            <CouponProvider>
              {currentStep === "cart" && (
                <PaymentProvider>
                  <CartItems onProceedToCheckout={() => handleStepChange("checkout")} onClose={handleClose} />
                </PaymentProvider>
              )}
              {currentStep === "checkout" && (
                <PaymentProvider>
                  <AddressProvider>
                    <CheckoutFlow
                      handleClose={() => setIsOpen(false)}
                      onSuccess={(data) => handleStepChange("cart", data)}
                      onBack={() => handleStepChange("cart")}
                    />
                  </AddressProvider>
                </PaymentProvider>
              )}
            </CouponProvider>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
