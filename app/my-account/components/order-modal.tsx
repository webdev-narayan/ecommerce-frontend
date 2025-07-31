"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { CalendarDays, CreditCard, MapPin, Package, Phone, Mail, User, Tag, Copy, Download, Truck } from "lucide-react"
import { Order } from "@/app/dashboard/orders/Order.type"
import { mediaUrlGenerator } from "@/lib/utils"
import moment from "moment"
import ReviewModal from "./review-modal"
import { Product } from "@/app/dashboard/products/product.type"



interface OrderViewModalProps {
    orderData: Order,
    setReviewProduct: any,
    setReviewOpen: any
}

export default function OrderViewModal({ orderData, setReviewProduct,
    setReviewOpen }: OrderViewModalProps) {
    const [isOpen, setIsOpen] = useState(false)

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const formatCurrency = (amount: number) => {
        return `₹${amount.toLocaleString("en-IN")}`
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "NEW":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "PROCESSING":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "SHIPPED":
                return "bg-purple-100 text-purple-800 border-purple-200"
            case "DELIVERED":
                return "bg-green-100 text-green-800 border-green-200"
            case "CANCELLED":
                return "bg-red-100 text-red-800 border-red-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case "PAID":
                return "bg-green-100 text-green-800 border-green-200"
            case "UNPAID":
                return "bg-red-100 text-red-800 border-red-200"
            case "PENDING":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const copyOrderId = () => {
        navigator.clipboard.writeText(orderData.order_id)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size={"sm"}>Order Details</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Package className="h-5 w-5" />
                        Order Details
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Order Header */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-lg">Order #{orderData.order_id}</h3>
                                        <Button variant="ghost" size="sm" onClick={copyOrderId} className="h-6 w-6 p-0">
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                        <CalendarDays className="h-3 w-3" />
                                        {moment(orderData.order_date).format("DD MM YYYY")}
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Badge className={getStatusColor(orderData.order_status)}>{orderData.order_status}</Badge>
                                    <Badge className={getPaymentStatusColor(orderData.payment_status)}>{orderData.payment_status}</Badge>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Customer Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <User className="h-4 w-4" />
                                    Customer Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">{orderData?.customer_name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{orderData?.customer_email}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Shipping Address */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <MapPin className="h-4 w-4" />
                                    Shipping Address
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="font-medium">{orderData.shipping_address?.name}</p>
                                    <p className="text-sm text-muted-foreground">{orderData.shipping_address?.line1}</p>
                                    <p className="text-sm text-muted-foreground">{orderData.shipping_address?.country}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="h-3 w-3 text-muted-foreground" />
                                        <span>{orderData.shipping_address?.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="h-3 w-3 text-muted-foreground" />
                                        <span>{orderData.shipping_address?.email}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Package className="h-4 w-4" />
                                Order Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {orderData.order_products.map((item, index) => (
                                    <div key={index} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg relative">
                                        <div className="w-[10%] aspect-square overflow-hidden">
                                            <img
                                                src={mediaUrlGenerator(item.product_variant?.thumbnail?.url || item.product.thumbnail?.url) || "/placeholder.svg"}
                                                alt={item.product.title}
                                                className="w-full h-full aspect-square object-cover rounded-md"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="space-y-1">
                                                <h4 className="font-medium">{item.product.title}</h4>

                                                <div className="flex items-center gap-2">

                                                    {item.product_variant?.sku && (
                                                        <p className="text-xs text-muted-foreground">SKU: {item.product_variant.sku}</p>
                                                    )}

                                                    {/* Product Variant Options */}
                                                    {item.product_variant?.variant_options && item.product_variant.variant_options.length > 0 && (
                                                        <div className="flex flex-wrap gap-2">
                                                            {item.product_variant.variant_options.map((option, optionIndex) => (
                                                                <Badge key={optionIndex} variant="secondary" className="text-xs">
                                                                    {option.variant_attribute.name}: {option.name}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                <div className="flex items-center gap-4 text-sm">
                                                    <span>Qty: {item.quantity}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span>Price: {formatCurrency(item.price)}</span>
                                                        {item.product_variant?.mrp && item.product_variant.mrp > item.price && (
                                                            <span className="text-xs text-muted-foreground line-through">
                                                                MRP: {formatCurrency(item.product_variant.mrp)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="font-medium">Total: {formatCurrency(item.total_amount)}</div>
                                            </div>
                                        </div>
                                        {
                                            orderData.order_status === "DELIVERED" && <Button
                                                onClick={() => {
                                                    setReviewProduct(item.product)
                                                    setReviewOpen(true)
                                                    setIsOpen(false)
                                                }}
                                                className="absolute right-4 top-4 bg-gray-800 hover:bg-gray-700 text-white text-xs" size={"sm"}>Write Review</Button>
                                        }

                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>



                    {/* Payment & Pricing */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Payment Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <CreditCard className="h-4 w-4" />
                                    Payment Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Method:</span>
                                    <span className="text-sm font-medium">{orderData.payment_method}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Gateway:</span>
                                    <span className="text-sm font-medium">{orderData.payment_gateway}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Status:</span>
                                    <Badge className={getPaymentStatusColor(orderData.payment_status)} variant="outline">
                                        {orderData.payment_status}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Tag className="h-4 w-4" />
                                    Order Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {(() => {
                                    const calculatedSubtotal =
                                        orderData.subtotal_amount ||
                                        orderData.order_products.reduce((sum, item) => sum + item.total_amount, 0)
                                    const discountAmount =
                                        orderData.discount || (orderData.coupon ? calculatedSubtotal - orderData.total_amount : 0)

                                    return (
                                        <>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Subtotal:</span>
                                                <span className="text-sm">{formatCurrency(orderData.subtotal_amount || 0)}</span>
                                            </div>

                                            {discountAmount > 0 && (
                                                <div className="flex justify-between text-green-600">
                                                    <span className="text-sm">
                                                        Discount {orderData.coupon ? `(${orderData.coupon.code})` : ""}:
                                                    </span>
                                                    <span className="text-sm">-{orderData.discount}</span>
                                                </div>
                                            )}

                                            <Separator />
                                            <div className="flex justify-between font-medium">
                                                <span>Total:</span>
                                                <span className="text-lg">{formatCurrency(orderData.total_amount)}</span>
                                            </div>
                                        </>
                                    )
                                })()}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button className="bg-transparent" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download Invoice
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
