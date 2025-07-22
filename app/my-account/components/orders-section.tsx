"use client"

import { cn } from "@/lib/utils"

import { useState, useEffect } from "react"
import {
  Search,
  Eye,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ShoppingBag,
  Package,
} from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Order } from "@/lib/types/type"
import { api } from "@/lib/mock-api"

const getStatusColor = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return "bg-green-50 text-green-700 border-green-200"
    case "SHIPPED":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "ACCEPTED":
      return "bg-yellow-50 text-yellow-700 border-yellow-200"
    case "CANCELLED":
      return "bg-red-50 text-red-700 border-red-200"
    case "NEW":
      return "bg-slate-50 text-slate-700 border-slate-200"
    default:
      return "bg-slate-50 text-slate-700 border-slate-200"
  }
}

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "PAID":
      return "bg-green-50 text-green-700 border-green-200"
    case "UNPAID":
      return "bg-red-50 text-red-700 border-red-200"
    case "REFUNDED":
      return "bg-orange-50 text-orange-700 border-orange-200"
    default:
      return "bg-slate-50 text-slate-700 border-slate-200"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return <CheckCircle className="h-3 w-3" />
    case "SHIPPED":
      return <Truck className="h-3 w-3" />
    case "ACCEPTED":
      return <Clock className="h-3 w-3" />
    case "CANCELLED":
      return <XCircle className="h-3 w-3" />
    case "NEW":
      return <ShoppingBag className="h-3 w-3" />
    default:
      return <Clock className="h-3 w-3" />
  }
}

export function OrdersSection() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    loadOrders()
  }, [searchTerm, statusFilter])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const data = await api.getOrders({
        status: statusFilter === "all" ? undefined : statusFilter,
        search: searchTerm || undefined,
      })
      setOrders(data)
    } catch (error) {
      console.error("Failed to load orders:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-64"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-slate-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">My Orders</h2>
        <p className="text-slate-600 mt-1">Track and manage your orders</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-slate-200 focus:border-slate-300"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[160px] border-slate-200">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="NEW">New</SelectItem>
            <SelectItem value="ACCEPTED">Accepted</SelectItem>
            <SelectItem value="SHIPPED">Shipped</SelectItem>
            <SelectItem value="DELIVERED">Delivered</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {orders.length === 0 ? (
        <Card className="border-slate-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-slate-400 mb-4" />
            <p className="text-slate-600 text-center">No orders found</p>
            <p className="text-slate-500 text-sm text-center mt-1">
              {searchTerm || statusFilter !== "all" ? "Try adjusting your filters" : "Your orders will appear here"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.order_id} className="border-slate-200 hover:shadow-sm transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <CardTitle className="text-lg font-medium text-slate-900 truncate">{order.order_id}</CardTitle>
                    <CardDescription className="text-slate-500">
                      Ordered on{" "}
                      {order.order_date.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Badge className={cn("border w-fit", getStatusColor(order.order_status))}>
                      {getStatusIcon(order.order_status)}
                      {order.order_status}
                    </Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-200 bg-transparent w-full sm:w-auto"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Order Details - {order.order_id}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-slate-700 mb-1">Order Status</p>
                              <Badge className={cn("border", getStatusColor(order.order_status))}>
                                {getStatusIcon(order.order_status)}
                                {order.order_status}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-700 mb-1">Payment Status</p>
                              <Badge className={cn("border", getPaymentStatusColor(order.payment_status))}>
                                {order.payment_status}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-700 mb-1">Payment Method</p>
                              <p className="text-sm text-slate-600">{order.payment_method}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-700 mb-1">Total Amount</p>
                              <p className="text-sm font-semibold text-slate-900">₹{order.total_amount.toFixed(2)}</p>
                            </div>
                          </div>
                          <Separator />
                          <div>
                            <p className="text-sm font-medium text-slate-700 mb-3">Order Items</p>
                            <div className="space-y-3">
                              {order.order_products.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg"
                                >
                                  <Image
                                    src={item.product.thumbnail?.url || "/placeholder.svg"}
                                    alt={item.product.thumbnail?.alt || "Product"}
                                    width={60}
                                    height={60}
                                    className="rounded-md object-cover border border-slate-200"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-slate-900 truncate">{item.product.title}</p>
                                    <p className="text-sm text-slate-500">
                                      Quantity: {item.quantity} × ₹{item.price.toFixed(2)}
                                    </p>
                                  </div>
                                  <p className="font-semibold text-slate-900">₹{item.total_amount.toFixed(2)}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <Separator />
                          <div>
                            <p className="text-sm font-medium text-slate-700 mb-2">Shipping Address</p>
                            <div className="text-sm text-slate-600 space-y-1">
                              <p className="font-medium">{order.shipping_address.name}</p>
                              <p>
                                {order.shipping_address.line1}
                                {order.shipping_address.line2 && `, ${order.shipping_address.line2}`}
                              </p>
                              <p>
                                {order.shipping_address.city}, {order.shipping_address.state} -{" "}
                                {order.shipping_address.pincode}
                              </p>
                              <p>{order.shipping_address.phone}</p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <CreditCard className="h-3 w-3" />
                      <span>{order.payment_method}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span className="truncate">
                        Delivery: {order.deliver_date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-start">
                    <p className="font-semibold text-slate-900">₹{order.total_amount.toFixed(2)}</p>
                    <Badge className={cn("border text-xs", getPaymentStatusColor(order.payment_status))}>
                      {order.payment_status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
