"use client"

import { useState } from "react"
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
  DollarSign,
  Receipt,
  Scan,
  UserPlus,
  Menu,
} from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for products
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 99.99,
    stock: 25,
    category: "Electronics",
    barcode: "1234567890123",
    image: "/placeholder.svg?height=100&width=100&query=wireless+headphones",
  },
  {
    id: 2,
    name: "Phone Case",
    price: 19.99,
    stock: 50,
    category: "Accessories",
    barcode: "1234567890124",
    image: "/placeholder.svg?height=100&width=100&query=phone+case",
  },
  {
    id: 3,
    name: "Laptop Stand",
    price: 49.99,
    stock: 15,
    category: "Electronics",
    barcode: "1234567890125",
    image: "/placeholder.svg?height=100&width=100&query=laptop+stand",
  },
  {
    id: 4,
    name: "Gaming Mouse",
    price: 79.99,
    stock: 30,
    category: "Electronics",
    barcode: "1234567890126",
    image: "/placeholder.svg?height=100&width=100&query=gaming+mouse",
  },
  {
    id: 5,
    name: "Bluetooth Speaker",
    price: 129.99,
    stock: 20,
    category: "Electronics",
    barcode: "1234567890127",
    image: "/placeholder.svg?height=100&width=100&query=bluetooth+speaker",
  },
  {
    id: 6,
    name: "USB Cable",
    price: 9.99,
    stock: 100,
    category: "Accessories",
    barcode: "1234567890128",
    image: "/placeholder.svg?height=100&width=100&query=usb+cable",
  },
]

// Mock customers
const customers = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "+1234567890" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "+1234567891" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", phone: "+1234567892" },
]

const paymentMethods = [
  { value: "cash", label: "Cash", icon: DollarSign },
  { value: "card", label: "Credit/Debit Card", icon: CreditCard },
  { value: "upi", label: "UPI", icon: CreditCard },
  { value: "wallet", label: "Digital Wallet", icon: CreditCard },
]

export default function POSPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [cart, setCart] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [showCustomerDialog, setShowCustomerDialog] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [showReceiptDialog, setShowReceiptDialog] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [amountReceived, setAmountReceived] = useState("")
  const [discount, setDiscount] = useState(0)
  const [notes, setNotes] = useState("")
  const [lastTransaction, setLastTransaction] = useState(null)
  const [activeTab, setActiveTab] = useState("products")

  // Get unique categories
  const categories = ["all", ...new Set(products.map((p) => p.category))]

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.barcode.includes(searchTerm)
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = (subtotal * discount) / 100
  const total = subtotal - discountAmount
  const tax = total * 0.1 // 10% tax
  const grandTotal = total + tax

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id)

    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
      } else {
        toast.error("Not enough stock available")
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }

    // Auto-switch to cart on mobile after adding item
    if (window.innerWidth < 768) {
      setActiveTab("cart")
    }
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId)
      return
    }

    const product = products.find((p) => p.id === productId)
    if (newQuantity > product.stock) {
      toast.error("Not enough stock available")
      return
    }

    setCart(cart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)))
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId))
  }

  const clearCart = () => {
    setCart([])
    setSelectedCustomer(null)
    setDiscount(0)
    setNotes("")
  }

  const handlePayment = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty")
      return
    }
    setShowPaymentDialog(true)
  }

  const processPayment = () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method")
      return
    }

    if (paymentMethod === "cash") {
      const received = Number.parseFloat(amountReceived)
      if (!received || received < grandTotal) {
        toast.error("Insufficient amount received")
        return
      }
    }

    // Create transaction
    const transaction = {
      id: `TXN-${Date.now()}`,
      items: [...cart],
      customer: selectedCustomer,
      subtotal,
      discount: discountAmount,
      tax,
      total: grandTotal,
      paymentMethod,
      amountReceived: paymentMethod === "cash" ? Number.parseFloat(amountReceived) : grandTotal,
      change: paymentMethod === "cash" ? Number.parseFloat(amountReceived) - grandTotal : 0,
      notes,
      timestamp: new Date(),
    }

    setLastTransaction(transaction)
    setShowPaymentDialog(false)
    setShowReceiptDialog(true)

    // Clear cart and reset
    clearCart()
    setPaymentMethod("")
    setAmountReceived("")

    toast.success("Payment processed successfully!")
  }

  const printReceipt = () => {
    // In a real app, this would trigger actual printing
    toast.success("Receipt sent to printer")
    setShowReceiptDialog(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Layout */}
      <div className="md:hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-screen flex flex-col">
          {/* Mobile Header */}
          <div className="bg-white border-b p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Point of Sale</h1>
              <Badge variant="secondary" className="text-sm">
                {cart.length} items
              </Badge>
            </div>

            {/* Mobile Tabs */}
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Menu className="h-4 w-4" />
                Products
              </TabsTrigger>
              <TabsTrigger value="cart" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Cart
                {cart.length > 0 && (
                  <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">
                    {cart.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Products Tab */}
          <TabsContent value="products" className="flex-1 overflow-hidden m-0">
            <div className="h-full flex flex-col">
              {/* Search and Filters */}
              <div className="p-4 space-y-3 bg-white border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search products or scan barcode..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-12"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="flex-1 h-10">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === "all" ? "All Categories" : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <Scan className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Products Grid */}
              <div className="flex-1 overflow-auto p-4">
                <div className="grid grid-cols-2 gap-3">
                  {filteredProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="cursor-pointer hover:shadow-md transition-shadow active:scale-95"
                      onClick={() => addToCart(product)}
                    >
                      <CardContent className="p-3">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-24 object-cover rounded mb-2"
                        />
                        <h3 className="font-medium text-sm mb-1 line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
                        <p className="text-lg font-bold text-green-600">${product.price}</p>
                        <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Cart Tab */}
          <TabsContent value="cart" className="flex-1 overflow-hidden m-0">
            <div className="h-full flex flex-col">
              {/* Customer Selection */}
              <div className="p-4 bg-white border-b space-y-3">
                <Label className="text-sm font-medium">Customer</Label>
                <div className="flex gap-2">
                  <Select
                    value={selectedCustomer?.id?.toString() || ""}
                    onValueChange={(value) => {
                      const customer = customers.find((c) => c.id.toString() === value)
                      setSelectedCustomer(customer || null)
                    }}
                  >
                    <SelectTrigger className="flex-1 h-10">
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id.toString()}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setShowCustomerDialog(true)}
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-auto">
                {cart.length === 0 ? (
                  <div className="text-center text-gray-500 mt-12 px-4">
                    <ShoppingCart className="mx-auto h-16 w-16 mb-4 opacity-50" />
                    <p className="text-lg font-medium">Cart is empty</p>
                    <p className="text-sm">Add products to get started</p>
                    <Button variant="outline" className="mt-4" onClick={() => setActiveTab("products")}>
                      Browse Products
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    {cart.map((item) => (
                      <Card key={item.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm mb-1">{item.name}</h4>
                              <p className="text-sm text-gray-600 mb-2">${item.price}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t text-right">
                            <span className="font-semibold text-lg">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Summary */}
              {cart.length > 0 && (
                <div className="bg-white border-t p-4 space-y-4">
                  {/* Discount */}
                  <div className="flex items-center gap-3">
                    <Label htmlFor="discount" className="text-sm font-medium">
                      Discount %
                    </Label>
                    <Input
                      id="discount"
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Math.max(0, Math.min(100, Number.parseFloat(e.target.value) || 0)))}
                      className="w-24 h-10"
                      min="0"
                      max="100"
                    />
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({discount}%):</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Tax (10%):</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span>${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <Label htmlFor="notes" className="text-sm font-medium">
                      Notes
                    </Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes..."
                      className="h-16 text-sm mt-1"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={clearCart} className="flex-1">
                      Clear Cart
                    </Button>
                    <Button onClick={handlePayment} className="flex-1" size="lg">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Checkout ${grandTotal.toFixed(2)}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex h-screen">
        {/* Left Panel - Products */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b p-4">
            <h1 className="text-2xl font-bold mb-4">Point of Sale</h1>

            {/* Search and Filters */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products or scan barcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Scan className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 overflow-auto p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => addToCart(product)}
                >
                  <CardContent className="p-3">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-20 object-cover rounded mb-2"
                    />
                    <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-lg font-bold text-green-600">${product.price}</p>
                    <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Cart */}
        <div className="w-96 bg-white border-l flex flex-col">
          {/* Cart Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Cart ({cart.length})
              </h2>
              {cart.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearCart}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Customer Selection */}
            <div className="space-y-2">
              <Label>Customer</Label>
              <div className="flex gap-2">
                <Select
                  value={selectedCustomer?.id?.toString() || ""}
                  onValueChange={(value) => {
                    const customer = customers.find((c) => c.id.toString() === value)
                    setSelectedCustomer(customer || null)
                  }}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id.toString()}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={() => setShowCustomerDialog(true)}>
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <ShoppingCart className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Cart is empty</p>
                <p className="text-sm">Add products to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.name}</h4>
                          <p className="text-sm text-gray-600">${item.price}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 ml-1"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2 text-right">
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Cart Summary */}
          {cart.length > 0 && (
            <div className="border-t p-4 space-y-4">
              {/* Discount */}
              <div className="flex items-center gap-2">
                <Label htmlFor="discount" className="text-sm">
                  Discount %
                </Label>
                <Input
                  id="discount"
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Math.max(0, Math.min(100, Number.parseFloat(e.target.value) || 0)))}
                  className="w-20 h-8"
                  min="0"
                  max="100"
                />
              </div>

              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discount}%):</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax (10%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes" className="text-sm">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes..."
                  className="h-16 text-sm"
                />
              </div>

              {/* Checkout Button */}
              <Button onClick={handlePayment} className="w-full" size="lg">
                <CreditCard className="mr-2 h-4 w-4" />
                Checkout ${grandTotal.toFixed(2)}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Customer Dialog */}
      <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
        <DialogContent className="mx-4 max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>Create a new customer profile</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="customerName">Name</Label>
              <Input id="customerName" placeholder="Customer name" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="customerEmail">Email</Label>
              <Input id="customerEmail" type="email" placeholder="customer@example.com" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="customerPhone">Phone</Label>
              <Input id="customerPhone" placeholder="+1234567890" className="mt-1" />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowCustomerDialog(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              onClick={() => {
                // In a real app, you would save the customer
                toast.success("Customer added successfully")
                setShowCustomerDialog(false)
              }}
              className="w-full sm:w-auto"
            >
              Add Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="mx-4 max-w-md">
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
            <DialogDescription>Complete the transaction for ${grandTotal.toFixed(2)}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Payment Method</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {paymentMethods.map((method) => (
                  <Button
                    key={method.value}
                    variant={paymentMethod === method.value ? "default" : "outline"}
                    onClick={() => setPaymentMethod(method.value)}
                    className="h-16 flex flex-col items-center justify-center"
                  >
                    <method.icon className="h-5 w-5 mb-1" />
                    <span className="text-xs text-center">{method.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {paymentMethod === "cash" && (
              <div>
                <Label htmlFor="amountReceived">Amount Received</Label>
                <Input
                  id="amountReceived"
                  type="number"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  className="mt-1 text-lg"
                />
                {amountReceived && Number.parseFloat(amountReceived) >= grandTotal && (
                  <p className="text-sm text-green-600 mt-2 font-medium">
                    Change: ${(Number.parseFloat(amountReceived) - grandTotal).toFixed(2)}
                  </p>
                )}
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Amount:</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={processPayment} className="w-full sm:w-auto">
              Process Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
        <DialogContent className="mx-4 max-w-md max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Transaction Complete</DialogTitle>
            <DialogDescription>Payment processed successfully</DialogDescription>
          </DialogHeader>
          {lastTransaction && (
            <div className="space-y-4">
              {/* Receipt */}
              <div className="bg-white border p-4 text-sm font-mono">
                <div className="text-center mb-4">
                  <h3 className="font-bold text-lg">StoreFront</h3>
                  <p>Receipt</p>
                  <p>{format(lastTransaction.timestamp, "MMM dd, yyyy HH:mm")}</p>
                  <p>Transaction: {lastTransaction.id}</p>
                </div>

                <div className="border-t border-b py-2 mb-2">
                  {lastTransaction.items.map((item, index) => (
                    <div key={index} className="flex justify-between py-1">
                      <span className="flex-1">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${lastTransaction.subtotal.toFixed(2)}</span>
                  </div>
                  {lastTransaction.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-${lastTransaction.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${lastTransaction.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-1 text-base">
                    <span>Total:</span>
                    <span>${lastTransaction.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t">
                  <div className="flex justify-between">
                    <span>Payment:</span>
                    <span>{paymentMethods.find((m) => m.value === lastTransaction.paymentMethod)?.label}</span>
                  </div>
                  {lastTransaction.paymentMethod === "cash" && (
                    <>
                      <div className="flex justify-between">
                        <span>Received:</span>
                        <span>${lastTransaction.amountReceived.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Change:</span>
                        <span>${lastTransaction.change.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>

                {lastTransaction.customer && (
                  <div className="mt-4 pt-2 border-t">
                    <p>Customer: {lastTransaction.customer.name}</p>
                  </div>
                )}

                <div className="text-center mt-4 pt-2 border-t">
                  <p>Thank you for your business!</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowReceiptDialog(false)} className="w-full sm:w-auto">
              Close
            </Button>
            <Button onClick={printReceipt} className="w-full sm:w-auto">
              <Receipt className="mr-2 h-4 w-4" />
              Print Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
