/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"

import { useEffect, useState } from "react"
import { Edit, Grid, List, LucideEye, MoreHorizontal, Package, Plus, Search, Trash, Trash2, X, } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deleteApi, getApi, postApi, putApi } from "@/lib/api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomPagination from "@/components/ui/custom-pagination";
import { MetaResponse } from "@/lib/types/type";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, } from "@/components/ui/sheet";

import { Coupon } from './coupon.type';
import moment from "moment"
import { Badge } from "@/components/ui/badge"

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([])
    const [selectedCoupons, setSelectedCoupons] = useState<number[]>([])
    const [isCouponFormOpen, setIsCouponFormOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [couponToAction, setCouponToAction] = useState<Coupon | null>(null)

    const [searchTerm, setSearchTerm] = useState<string>("")
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
    const [viewMode, setViewMode] = useState("list")
    const [debouncedSearchedQuery, setDebouncedSearchedQuery] = useState("")
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    const [meta, setMeta] = useState<MetaResponse>()
    const [isMobile, setIsMobile] = useState(false)


    async function getCoupons() {
        const query = new URLSearchParams();

        query.append("pagination[page]", page.toString());
        query.append("pagination[pageSize]", pageSize.toString());

        if (debouncedSearchedQuery.trim()) {
            query.append("filters[code][$containsi]", debouncedSearchedQuery);
        }

        const res = await getApi<{ data: Coupon[], meta: MetaResponse }>(`/coupons?${query}`, true)
        if (res.success && res.data) {
            setCoupons(res.data?.data)
            setMeta(res.data?.meta)
        }
    }

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedCoupons(coupons.map((coupon) => coupon.id))
        } else {
            setSelectedCoupons([])
        }
    }

    const handleSelectCoupon = (couponId: number, checked: string | boolean) => {
        if (checked) {
            setSelectedCoupons([...selectedCoupons, couponId])
        } else {
            setSelectedCoupons(selectedCoupons.filter((id) => id !== couponId))
        }
    }

    const handleDeleteCoupon = (coupon: Coupon) => {
        setCouponToAction(coupon)
        setIsDeleteDialogOpen(true)
    }
    const handleEditCoupon = (coupon: Coupon) => {
        setIsEditing(true)
        setCouponToAction(coupon)
        setIsCouponFormOpen(true)

    }

    const confirmDelete = async () => {

        const res = await deleteApi(`/coupons/${couponToAction?.documentId}`)
        if (res.success) {

            toast.success(`Coupon "${couponToAction?.code}" deleted successfully`)
            setCoupons(coupons.filter((coupon) => coupon.id !== couponToAction?.id))
            setIsDeleteDialogOpen(false)
            setCouponToAction(null)
        }
    }

    // const handleBulkDelete = () => {
    //     // In a real app, you would call an API to delete the selected coupons
    //     toast.success(`${selectedCoupons.length} coupons deleted successfully`)
    //     setSelectedCoupons([])
    // }

    const handleSaveCoupon = async (formData: FormData) => {
        const name = formData.get("name") as string
        const description = formData.get("description") as string

        if (isEditing && couponToAction) {
            const res = await putApi<{ data: Coupon }>(`/coupons/${couponToAction.documentId}`, {
                data: {
                    name,
                    description
                }
            }, true)
            if (res.success && res.data) {
                toast.success("Coupon added successfully")
                setCoupons(coupons.map((coupon) => {
                    // @ts-ignore
                    if (coupon.id === res?.data.data.id) {
                        return res.data.data
                    }
                    return coupon
                }))
                setIsCouponFormOpen(false)
            }

        } else {
            const res = await postApi<{ data: Coupon }>("/coupons", { data: { name, description } }, true)
            if (res.success && res.data) {
                toast.success("Coupon added successfully")
                setCoupons([...coupons, res.data.data])
                setIsCouponFormOpen(false)
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
        getCoupons()
    }, [debouncedSearchedQuery])

    useEffect(() => {
        if (!isCouponFormOpen) {
            setIsEditing(false)
        }
    }, [isCouponFormOpen])

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkScreenSize()
        window.addEventListener("resize", checkScreenSize)

        return () => window.removeEventListener("resize", checkScreenSize)
    }, [])

    return (
        <>
            <div className="container mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="md:text-3xl font-bold">Coupons</h1>
                    <Button
                        // onClick={() => redirect("/dashboard/products/create")}
                        onClick={() => setIsCouponFormOpen(true)}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        <span className={"hidden md:inline"}>
                            Add Coupon
                        </span>
                    </Button>
                    <Sheet open={isCouponFormOpen} onOpenChange={setIsCouponFormOpen}>
                        <SheetContent side={isMobile ? "bottom" : "right"}
                            className={isMobile ? "h-[85vh]" : "w-[400px] sm:w-[540px]"}>
                            <SheetHeader>
                                <SheetTitle>Create New Coupon</SheetTitle>
                                <SheetDescription>
                                    Add a new coupon with a code. Click save when you are done.
                                </SheetDescription>
                            </SheetHeader>

                            <form action={handleSaveCoupon} className="space-y-6 py-6">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="name">Coupon Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        {...(isEditing && couponToAction && { value: couponToAction.code })}
                                        placeholder="Enter coupon name"
                                        required
                                    />
                                </div>
                                <SheetFooter className="flex flex-col sm:flex-row gap-2">
                                    <Button type="button" variant="outline" onClick={() => setIsCouponFormOpen(false)}
                                        className="w-full sm:w-auto">
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="w-full sm:w-auto">
                                        Create Coupon
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
                                    placeholder="Search coupons..."
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
                                                    checked={selectedCoupons.length === coupons.length && coupons.length > 0}
                                                    onCheckedChange={handleSelectAll}
                                                />
                                            </TableHead>
                                            <TableHead>Code</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Discount</TableHead>
                                            <TableHead>Expiry</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Limit</TableHead>
                                            <TableHead>Usage</TableHead>
                                            <TableHead className="text-center">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {coupons.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-8">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <Package className="h-12 w-12 text-gray-300 mb-2" />
                                                        <h3 className="text-lg font-medium">No coupons found</h3>
                                                        <p className="text-sm text-gray-500 mb-4">
                                                            {searchTerm ? "Try a different search term" : "Add a coupon to get started"}
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
                                            coupons.map((coupon: Coupon) => (
                                                <TableRow key={coupon.id}>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={selectedCoupons.includes(coupon.id)}
                                                            onCheckedChange={(checked) => handleSelectCoupon(coupon.id, checked)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-medium">{coupon.code}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-medium">{coupon.discount_type}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-medium">{coupon.discount_value}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-medium">{moment(coupon.expires_at).format("YYYY-MM-DD")}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-medium">
                                                            <Badge>
                                                                {coupon.is_active ? "Active" : "Inactive"}
                                                            </Badge>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-medium">{coupon.usage_limit}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-medium">{coupon.usage_count}</div>
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
                                                                    onClick={() => handleEditCoupon(coupon)}
                                                                >
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit coupon
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>View products</DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="text-red-600"
                                                                    onClick={() => handleDeleteCoupon(coupon)}>
                                                                    <Trash className="mr-2 h-4 w-4" />
                                                                    Delete coupon
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
                            {coupons.length > 0 ? coupons.map((coupon: Coupon) => (
                                <Card
                                    key={coupon.id}
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
                                                            onClick={() => handleEditCoupon(coupon)}
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit coupon
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <LucideEye className="mr-2 h-4 w-4" />
                                                            View products
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-red-600"
                                                            onClick={() => handleDeleteCoupon(coupon)}>
                                                            <Trash className="mr-2 h-4 w-4" />
                                                            Delete coupon
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-4">
                                        <div className="space-y-2">
                                            <div className="flex items-start justify-between">
                                                <h3 className="font-semibold text-gray-900 line-clamp-1">{coupon.code}</h3>
                                            </div>
                                            {/*<p className="text-sm text-gray-600 line-clamp-2">{coupon.description}</p>*/}
                                            <div className="flex items-center justify-between pt-2">
                                                <div
                                                    className="flex justify-between w-full items-center gap-1 text-sm text-gray-500">
                                                    Products <div
                                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${coupon?.usage_limit >= coupon.usage_count
                                                            ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                            }`}
                                                    >
                                                        <Package className="h-4 w-4 mr-1" />
                                                        <span>{100}</span>
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
                                            onClick={() => handleDeleteCoupon(coupon)}
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
                                    <h3 className="text-lg font-medium">No coupon found</h3>
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
                            <DialogTitle>Delete Coupon</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this coupon? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            {couponToAction && (
                                <div className="flex items-center space-x-4">
                                    <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center">
                                        <Package className="h-6 w-6 text-gray-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium">{couponToAction.code}</h4>
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
            </div >
        </>
    )
}
