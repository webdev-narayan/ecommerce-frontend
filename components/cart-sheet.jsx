"use client"

import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"

export function CartSheet() {
  const { items, getTotalItems, getTotalPrice, updateQuantity, removeItem } = useCart()

  const subtotal = getTotalPrice()
  const shipping = subtotal >= 50 ? 0 : 5.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleQuantityChange = (id, newQuantity) => {
    updateQuantity(id, newQuantity)
    if (newQuantity === 0) {
      toast.success("Item removed from cart")
    }
  }

  const handleRemoveItem = (id, name) => {
    removeItem(id)
    toast.success(`${name} removed from cart`)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-gray-900">
            {getTotalItems()}
          </Badge>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({getTotalItems()} items)</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Add some products to get started</p>
              <Link href="/shop">
                <Button>Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-6">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={isValidImageUrl(item.image) ? item.image : "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                        <p className="text-sm text-gray-500">{item.brand}</p>
                        <p className="text-sm font-semibold text-gray-900">${item.price}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveItem(item.id, item.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {subtotal < 50 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">Add ${(50 - subtotal).toFixed(2)} more for free shipping!</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Link href="/checkout" className="w-full">
                    <Button className="w-full bg-gray-900 hover:bg-gray-800">Checkout</Button>
                  </Link>
                  <Link href="/shop" className="w-full">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function isValidImageUrl(url) {
  return typeof url === "string" && url.trim() !== "" && url.startsWith("/")
}