"use client"

import { cn, mediaUrlGenerator } from "@/lib/utils"

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
  Phone,
  MapPin,
  User,
  Coins,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getApi, postApi } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import moment from "moment"
import { Order, OrderStatus } from "@/app/dashboard/orders/Order.type"
import OrderViewModal from "./order-modal"
import Image from "next/image"
import ReviewModal from "./review-modal"
import { Product } from "@/app/dashboard/products/product.type"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import StarRating from "@/components/ui/star-rating"
import { CreateReview } from "@/app/dashboard/reviews/review.type"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"

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
      return "bg-orange-50 text-orange-700 border-orange-200"
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
  const [orderStatus, setOrderStatus] = useState("all")
  const [debouncedSearchedQuery, setDebouncedSearchedQuery] = useState("")

  const [reviewModal, setReviewModal] = useState(false)
  const [reviewProduct, setReviewProduct] = useState<Product | undefined>(undefined)
  const { user } = useAuth()
  const [reviewForm, setReviewForm] = useState<CreateReview>({
    comment: "",
    product: undefined,
    rating: 1,
    user: undefined,
    images: null
  })

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchedQuery(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    loadOrders()
  }, [orderStatus, user, debouncedSearchedQuery])

  const loadOrders = async () => {
    try {
      if (!user) {
        return
      }
      setLoading(true)
      const query = new URLSearchParams();
      if (debouncedSearchedQuery.trim()) query.append("search", debouncedSearchedQuery)

      if (Object.values(OrderStatus).includes(orderStatus as OrderStatus)) {
        query.append("order_status", orderStatus)
      }
      const data = await getApi<{ data: Order[] }>(`/user/orders?${query.toString()}`, true)
      setOrders(data.data?.data ?? [])
    } catch (error) {
      console.error("Failed to load orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const submitReview = async () => {
    const res = await postApi("/reviews", { data: reviewForm }, true)
    if (res.success) {
      setReviewModal(false)
      setReviewProduct(undefined);
      toast.success("Reviews Added Succeessfuly")
    } else {
      toast.error("Error occured")
    }
  }

  useEffect(() => {
    if (reviewProduct && user) {
      setReviewForm({
        comment: "",
        product: reviewProduct?.id,
        rating: 4,
        user: user?.id,
        images: null
      })
    }
  }, [reviewProduct, user])

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
            placeholder="Enter Order Id..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-slate-200 focus:border-slate-300"
          />
        </div>
        <Select value={orderStatus} onValueChange={setOrderStatus}>
          <SelectTrigger className="w-full sm:w-[160px] border-slate-200">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            {Object.values(OrderStatus).map((status) => (
              <SelectItem key={status} value={status}>{status}</SelectItem>

            ))}
          </SelectContent>
        </Select>
      </div>

      {orders.length === 0 ? (
        <Card className="border-slate-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-slate-400 mb-4" />
            <p className="text-slate-600 text-center">No orders found</p>
            <p className="text-slate-500 text-sm text-center mt-1">
              {searchTerm || orderStatus !== "all" ? "Try adjusting your filters" : "Your orders will appear here"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.order_id} className="border-slate-200 hover:shadow-sm transition-shadow rounded-xl">
              <div className="flex md:flex-row flex-col p-2 gap-4">

                {/* image */}

                <div className={`md:w-[160px] md:h-[160px] h-[60px] flex md:grid gap-2 ${order.order_products.length === 1 ? "" : order.order_products.length === 2 ? "grid-rows-1 grid-cols-2" : "grid-rows-2 grid-cols-2"}`}>
                  {order.order_products.slice(0, 4).map((item, index) => {
                    return <div key={item.id} className="relative">
                      <Image
                        key={item.id}
                        width={100}
                        height={100}
                        alt="order iamge"
                        className="rounded-md w-full h-full aspect-square object-cover object-left-top"
                        src={mediaUrlGenerator(item.product_variant.thumbnail?.url || item.product.thumbnail?.url)}
                      />
                      {
                        index === 3 && order.order_products.length > 4 &&
                        <div className={`absolute inset-0 bg-black/50 rounded-md grid place-items-center text-white text-3xl`}>
                          +{order.order_products.length - 3}
                        </div>
                      }
                    </div>
                  })}
                </div>

                <div className="flex-1 flex flex-col gap-y-4 md:gap-y-2 justify-between text-gray-800">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="md:text-lg font-medium">{order.order_id}</h4>
                      <Badge className={cn("border w-fit text-xs flex items-center gap-1 py-1", getStatusColor(order.order_status))}>
                        {getStatusIcon(order.order_status)}
                        {order.order_status}
                      </Badge>
                    </div>

                    <div className="flex gap-x-4 items-center flex-wrap">
                      <span className="flex items-center gap-1">
                        <Coins className="size-4" />
                        <Badge className={cn("border text-xs", getPaymentStatusColor(order.payment_status))}>
                          {order.payment_status}
                        </Badge>
                      </span>
                      <h4 className="font-semibold text-slate-900 md:text-2xl">₹ {order.total_amount.toFixed(2)}</h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-x-4 gap-y-2 flex-wrap">
                    <span className="flex text-sm md:text-base items-center gap-2"> <User className="size-4" /> {order.user.name || order.user.username}</span>
                    <span className="flex text-sm md:text-base items-center gap-2"> <Phone className="size-4" /> {order.user.phone || order.user.username}</span>
                    <span className="flex text-sm md:text-base items-center gap-2"> <MapPin className="size-4" /> {order.shipping_address.city}, {order.shipping_address.state},{order.shipping_address.pincode} </span>
                  </div>

                  <div className="flex gap-4 items-center md:justify-start justify-between">
                    <span className="flex items-center gap-1 text-sm md:text-base">
                      <CreditCard className="md:size-5 size-4" />
                      {order.payment_method}
                    </span>

                    <span className="flex items-center gap-1 text-sm md:text-base">
                      <Calendar className="size-5" />
                      Delivery: {order.deliver_date?.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) || "N/A"}
                    </span>
                  </div>

                  <div className="flex md:items-center justify-between flex-col md:flex-row items-start gap-2">
                    <p className="text-slate-500">
                      Ordered on{" "}
                      {moment(order.order_date).format("DD/MM/YYYY HH:mm A")}
                    </p>
                    <OrderViewModal setReviewOpen={setReviewModal} setReviewProduct={setReviewProduct} orderData={order} />
                  </div>

                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {
        reviewProduct &&
        <Dialog open={reviewModal} onOpenChange={setReviewModal}>
          {/* <DialogTrigger className='hidden'>

          </DialogTrigger> */}
          <DialogContent className="min-w-2xl">
            <DialogTitle>
              Write a Product Review
            </DialogTitle>
            <div className="space-y-2">

              <div className="">
                <Label>Product</Label>
                <p>
                  {reviewProduct.title}
                </p>
              </div>

              <div>
                <Label>Rating</Label>
                <StarRating initialRating={reviewForm.rating} onRatingChange={(value) => setReviewForm(prev => ({ ...prev, rating: value }))} />
              </div>
              <div>
                <Label>Comment</Label>
                <Textarea value={reviewForm.comment} onChange={(value) => setReviewForm(prev => ({ ...prev, comment: value.target.value }))}></Textarea>
              </div>

              <div className="flex justify-end">
                <Button onClick={submitReview} className="">Submit</Button>
              </div>
            </div>



          </DialogContent>
        </Dialog>
      }

    </div>
  )
}
