"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, Smartphone, Banknote, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCart } from "@/lib/cart-context"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    notes: "",
    paymentMethod: "cod",
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (items.length === 0) {
      toast.error("Your cart is empty")
      router.push("/shop")
    }
  }, [items, router])

  const subtotal = getTotalPrice()
  const shipping = subtotal >= 50 ? 0 : 5.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number"
    }
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.state.trim()) newErrors.state = "State is required"
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required"
    else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const generateOrderNumber = () => {
    return "ORD" + Date.now().toString().slice(-8)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly")
      return
    }

    setIsLoading(true)

    try {
      // Simulate order processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newOrderNumber = generateOrderNumber()
      setOrderNumber(newOrderNumber)

      // Clear cart and show success
      clearCart()
      setShowSuccessDialog(true)
      toast.success("Order placed successfully!")
    } catch (error) {
      toast.error("Failed to place order. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false)
    router.push("/")
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link href="/shop">
              <Button variant="ghost" size="icon" className="mr-4">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className={errors.fullName ? "border-red-500" : ""}
                    />
                    {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="10-digit mobile number"
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="House number, street name, area"
                    className={errors.address ? "border-red-500" : ""}
                  />
                  {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      className={errors.state ? "border-red-500" : ""}
                    />
                    {errors.state && <p className="text-sm text-red-500 mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange("pincode", e.target.value)}
                      placeholder="6-digit pincode"
                      className={errors.pincode ? "border-red-500" : ""}
                    />
                    {errors.pincode && <p className="text-sm text-red-500 mt-1">{errors.pincode}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Any special instructions for delivery"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) => handleInputChange("paymentMethod", value)}
                >
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="cod" id="cod" />
                    <Banknote className="h-5 w-5 text-gray-600" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      Cash on Delivery (COD)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="upi" id="upi" />
                    <Smartphone className="h-5 w-5 text-gray-600" />
                    <Label htmlFor="upi" className="flex-1 cursor-pointer">
                      UPI (GPay, PhonePe, Paytm)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="card" id="card" />
                    <CreditCard className="h-5 w-5 text-gray-600" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      Credit/Debit Card
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          src={"/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <Separator />

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
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {subtotal >= 50 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800 font-medium">🎉 You qualify for free shipping!</p>
                  </div>
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-gray-900 hover:bg-gray-800"
                  size="lg"
                >
                  {isLoading ? "Processing..." : `Place Order - $${total.toFixed(2)}`}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <span>Order Placed Successfully!</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-600 mb-2">Thank you for your order!</p>
              <p className="text-lg font-semibold">Order Number: {orderNumber}</p>
              <p className="text-sm text-gray-500 mt-2">You will receive a confirmation email shortly.</p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleSuccessDialogClose} className="flex-1">
                Continue Shopping
              </Button>
              <Button variant="outline" onClick={handleSuccessDialogClose} className="flex-1">
                View Orders
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
