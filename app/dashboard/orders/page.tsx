/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"

import { useEffect, useState } from "react"
import {
  Edit,
  Grid,
  List, LucideEye,
  MoreHorizontal, Package,
  Plus,
  Search,
  Trash, Trash2,
  Upload, X,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deleteApi, getApi, postApi, putApi } from "@/lib/api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomPagination from "@/components/ui/custom-pagination";
import { MetaResponse } from "@/lib/types/type";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, } from "@/components/ui/sheet"

import { Order, OrderStatus, PaymentStatus } from './Order.type';
import moment from "moment"
import { Badge } from "@/components/ui/badge"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrders, setSelectedOrders] = useState<number[]>([])
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [orderToAction, setOrderToAction] = useState<Order | null>(null)

  const [searchTerm, setSearchTerm] = useState<string>("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState("list")
  const [debouncedSearchedQuery, setDebouncedSearchedQuery] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [meta, setMeta] = useState<MetaResponse>()
  const [isMobile, setIsMobile] = useState(false)


  async function getOrders() {
    const query = new URLSearchParams();

    query.append("pagination[page]", page.toString());
    query.append("pagination[pageSize]", pageSize.toString());
    query.append("populate[0]", "shipping_address")
    query.append("populate[1]", "order_products")
    if (debouncedSearchedQuery.trim()) {
      // query.append("filters[$or][customer_name][$containsi]", debouncedSearchedQuery);
      query.append("filters[order_id][$containsi]", debouncedSearchedQuery);
    }

    const res = await getApi<{ data: Order[], meta: MetaResponse }>(`/orders?${query}`, true)
    if (res.success && res.data) {
      setOrders(res.data?.data)
      setMeta(res.data?.meta)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(orders.map((order) => order.id))
    } else {
      setSelectedOrders([])
    }
  }

  const handleSelectOrder = (orderId: number, checked: string | boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId])
    } else {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId))
    }
  }

  const handleDeleteOrder = (order: Order) => {
    setOrderToAction(order)
    setIsDeleteDialogOpen(true)
  }
  const handleEditOrder = (order: Order) => {
    setIsEditing(true)
    setOrderToAction(order)
    setIsOrderFormOpen(true)

  }

  const confirmDelete = async () => {

    const res = await deleteApi(`/orders/${orderToAction?.documentId}`)
    if (res.success) {

      toast.success(`Order  deleted successfully`)
      setOrders(orders.filter((order) => order.id !== orderToAction?.id))
      setIsDeleteDialogOpen(false)
      setOrderToAction(null)
    }
  }

  // const handleBulkDelete = () => {
  //     // In a real app, you would call an API to delete the selected orders
  //     toast.success(`${selectedOrders.length} orders deleted successfully`)
  //     setSelectedOrders([])
  // }

  const handleSaveOrder = async (formData: FormData) => {
    const name = formData.get("name") as string
    const description = formData.get("description") as string

    if (isEditing && orderToAction) {
      const res = await putApi<{ data: Order }>(`/orders/${orderToAction.documentId}`, {
        data: {
          name,
          description
        }
      }, true)
      if (res.success && res.data) {
        toast.success("Order added successfully")
        setOrders(orders.map((order) => {
          // @ts-ignore
          if (order.id === res?.data.data.id) {
            return res.data.data
          }
          return order
        }))
        setIsOrderFormOpen(false)
      }

    } else {
      const res = await postApi<{ data: Order }>("/orders", { data: { name, description } }, true)
      if (res.success && res.data) {
        toast.success("Order added successfully")
        setOrders([...orders, res.data.data])
        setIsOrderFormOpen(false)
      }
    }
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchedQuery(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    getOrders()
  }, [debouncedSearchedQuery])

  useEffect(() => {
    if (!isOrderFormOpen) {
      setIsEditing(false)
    }
  }, [isOrderFormOpen])

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  function handleUpdateOrderStatus(documentId: string, checked: boolean): void {
    console.log(documentId, checked)
    throw new Error("Function not implemented.")
  }

  const getOrderStatusColor = (status: OrderStatus) => {
    return {
      [OrderStatus.ACCEPTED]: "bg-green-100 hover:bg-green-200 text-green-500",
      [OrderStatus.CANCELLED]: "bg-red-100 hover:bg-red-200 text-red-500",
      [OrderStatus.DELIVERED]: "bg-green-100 hover:bg-green-200 text-green-500",
      [OrderStatus.NEW]: "bg-orange-100 hover:bg-orange-200 text-orange-500",
      [OrderStatus.SHIPPED]: "bg-indigo-100 hover:bg-indigo-200 text-indogo-500",
    }[status];
  }

  const getPaymentStatusColor = (status: PaymentStatus) => {
    return {
      [PaymentStatus.PAID]: "bg-green-100 hover:bg-green-200 text-green-500",
      [PaymentStatus.UNPAID]: "bg-red-100 hover:bg-red-200 text-red-500",
      [PaymentStatus.REFUNDED]: "bg-orange-100 hover:bg-orange-200 text-orange-500",
    }[status];
  }



  return (
    <>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="md:text-3xl font-bold">Orders</h1>
          <Button
            // onClick={() => redirect("/dashboard/products/create")}
            onClick={() => setIsOrderFormOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className={"hidden md:inline"}>
              Add Order
            </span>
          </Button>
          <Sheet open={isOrderFormOpen} onOpenChange={setIsOrderFormOpen}>
            <SheetContent side={isMobile ? "bottom" : "right"}
              className={isMobile ? "h-[85vh]" : "w-[400px] sm:w-[540px]"}>
              <SheetHeader>
                <SheetTitle>Create New Order</SheetTitle>
                <SheetDescription>
                  Add a new order with a name and logo. Click save when you are done.
                </SheetDescription>
              </SheetHeader>

              <form action={handleSaveOrder} className="space-y-6 py-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Order Name</Label>
                  <Input
                    id="name"
                    name="name"
                    {...(isEditing && orderToAction && { value: orderToAction.coupon })}
                    placeholder="Enter order name"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="image" className="">
                    Image
                  </Label>
                  <div className="col-span-3">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-3 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag
                            and drop
                          </p>
                          <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX.
                            2MB)</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>

                <SheetFooter className="flex flex-col sm:flex-row gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsOrderFormOpen(false)}
                    className="w-full sm:w-auto">
                    Cancel
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto">
                    Create Order
                  </Button>
                </SheetFooter>
              </form>
            </SheetContent>
          </Sheet>
        </div>

        <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
          <div className="flex justify-between md:flex-row flex-col mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    className="absolute right-0 top-0 h-full aspect-square rounded-l-none"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <TabsList className="grid w-[200px] grid-cols-2">
              <TabsTrigger value="list">
                <List className="h-4 w-4 mr-2" />
                List
              </TabsTrigger>
              <TabsTrigger value="grid">
                <Grid className="h-4 w-4 mr-2" />
                Grid
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="list" className="mt-0">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={selectedOrders.length === orders.length && orders.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Order Id</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center">
                            <Upload className="h-12 w-12 text-gray-300 mb-2" />
                            <h3 className="text-lg font-medium">No orders found</h3>
                            <p className="text-sm text-gray-500 mb-4">
                              {searchTerm ? "Try a different search term" : "Add a order to get started"}
                            </p>
                            {searchTerm && (
                              <Button variant="outline" onClick={() => setSearchTerm("")}>
                                Clear Search
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      orders.map((order: Order) => (
                        <TableRow key={order.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedOrders.includes(order.id)}
                              onCheckedChange={(checked) => handleSelectOrder(order.id, checked)}
                            />
                          </TableCell>
                          <TableCell className="">
                            <div className="font-medium">{order.order_id}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium flex flex-col">
                              <span className="capitalize">
                                {order?.customer_name ?? order.user?.name}
                              </span>
                              <span className="opacity-50">
                                {order?.customer_email ?? order.user?.email}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              <Badge className={`${getOrderStatusColor(order.order_status)}`}>
                                {order.order_status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              <Badge variant={"outline"}>
                                {order?.order_products?.length}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              <Badge className={`${getPaymentStatusColor(order.payment_status)}`}>
                                {order.payment_status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">₹ {order.total_amount}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {moment(order.order_date).format("DD MMM YYYY")}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => handleEditOrder(order)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit order
                                </DropdownMenuItem>
                                <DropdownMenuItem>View items</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600"
                                  onClick={() => handleDeleteOrder(order)}>
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete order
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grid" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {orders.length > 0 ? orders.map((order: Order) => (
                <Card
                  key={order.id}
                  className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white"
                >
                  <CardHeader className="p-0">
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <div className="absolute top-3 right-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={"h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm"}
                            >
                              <MoreHorizontal className="h-4 w-4 " />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleEditOrder(order)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit order
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <LucideEye className="mr-2 h-4 w-4" />
                              View products
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600"
                              onClick={() => handleDeleteOrder(order)}>
                              <Trash className="mr-2 h-4 w-4" />
                              Delete order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{order.order_id}</h3>
                      </div>
                      {/*<p className="text-sm text-gray-600 line-clamp-2">{order.description}</p>*/}
                      <div className="flex items-center justify-between pt-2">
                        <div
                          className="flex justify-between w-full items-center gap-1 text-sm text-gray-500">
                          <div
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getOrderStatusColor(order?.order_status)}`}
                          >

                            <span>{order.order_status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-white text-gray-700 px-1.5 py-1.5 border-gray-200 hover:bg-gray-50"
                    >
                      <Edit className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteOrder(order)}
                      className="flex-1 bg-white px-1.5 py-1.5 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))
                :
                <div
                  className="flex flex-col items-center justify-center bg-white shadow-sm rounded-md p-8 col-span-full">
                  <Package className="h-12 w-12 text-gray-300 mb-2" />
                  <h3 className="text-lg font-medium">No order found</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {searchTerm ? "Try a different search term" : "Add a product to get started"}
                  </p>
                  {searchTerm && (
                    <Button variant="outline" onClick={() => setSearchTerm("")}>
                      Clear Search
                    </Button>
                  )}
                </div>
              }
            </div>
          </TabsContent>

        </Tabs>

        <div className="flex bg-white p-2 w-fit ml-auto mt-4 shadow-md rounded-md">
          <CustomPagination
            setPage={setPage}
            meta={meta}
            setPageSize={setPageSize}
          />
        </div>

        {/* Delete Confirmation Dialog */
        }
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Order</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this order? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {orderToAction && (
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center">
                    <Package className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">{orderToAction.order_id}</h4>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
