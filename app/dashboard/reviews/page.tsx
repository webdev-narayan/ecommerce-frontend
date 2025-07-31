/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"

import { useEffect, useState } from "react"
import { Edit, Eye, MoreHorizontal, Package, Plus, Search, Trash, X, } from "lucide-react"
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
import CustomPagination from "@/components/ui/custom-pagination";
import { MetaResponse } from "@/lib/types/type";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, } from "@/components/ui/sheet";

import { CreateReview, Review } from './review.type';
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Product } from "../products/product.type"
import { CustomCombobox } from "@/components/custom-combobox"
import { Textarea } from "@/components/ui/textarea"
import { User } from "@/lib/types/auth"
import { Slider } from "@/components/ui/slider"
import { DialogTrigger } from "@radix-ui/react-dialog"
import Image from "next/image"
import { mediaUrlGenerator } from "@/lib/utils"

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [selectedReviews, setSelectedReviews] = useState<number[]>([])
    const [isCouponFormOpen, setIsCouponFormOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [reviewToAction, setCouponToAction] = useState<Review | null>(null)

    const [searchTerm, setSearchTerm] = useState<string>("")
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
    const [debouncedSearchedQuery, setDebouncedSearchedQuery] = useState("")
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    const [meta, setMeta] = useState<MetaResponse>()
    const [isMobile, setIsMobile] = useState(false)
    const [products, setProducts] = useState<Product[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [selectedProduct, setSelectedProduct] = useState<string>("")
    const [selectedUser, setSeletedUser] = useState<string>("")

    async function getReviews() {
        const query = new URLSearchParams();

        query.append("pagination[page]", page.toString());
        query.append("pagination[pageSize]", pageSize.toString());

        if (debouncedSearchedQuery.trim()) {
            query.append("filters[code][$containsi]", debouncedSearchedQuery);
        }

        const res = await getApi<{ data: Review[], meta: MetaResponse }>(`/reviews?${query}`, true)
        if (res.success && res.data) {
            setReviews(res.data?.data)
            setMeta(res.data?.meta)
        }
    }


    const getProudcts = async (search: string): Promise<{ label: string, value: string }[]> => {
        const query = new URLSearchParams();
        query.append("pagination[page]", "1")
        query.append("pagination[pageSize]", "50")

        if (search.trim().length > 3) {
            query.append("filters[title][$containsi]", search)
        }
        const res = await getApi<{ data: Product[] }>(`/products?${query.toString()}`)
        return res.data?.data?.map((item) => ({ value: item.id.toString(), label: item.title })) ?? []
    }

    const initialProudcts = async (search: string) => {
        const query = new URLSearchParams();
        query.append("pagination[page]", "1")
        query.append("pagination[pageSize]", "50")

        const res = await getApi<{ data: Product[] }>(`/products?${query.toString()}`)
        setProducts(res.data?.data ?? [])
    }

    const getUsers = async (search: string): Promise<{ label: string, value: string }[]> => {
        const query = new URLSearchParams();
        query.append("pagination[page]", "1")
        query.append("pagination[pageSize]", "50")

        if (search.trim().length > 3) {
            query.append("filters[name][$containsi]", search)
        }
        const res = await getApi<User[]>(`/users?${query.toString()}`, true)
        return res.data?.map((item) => ({ value: item.id.toString(), label: item.name || item.username })) ?? []
    }

    const initialUsers = async (search: string) => {
        const query = new URLSearchParams();
        query.append("pagination[page]", "1")
        query.append("pagination[pageSize]", "50")

        const res = await getApi<User[]>(`/users?${query.toString()}`, true)
        setUsers(res.data ?? [])
    }

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedReviews(reviews.map((review) => review.id))
        } else {
            setSelectedReviews([])
        }
    }

    const handleSelectCoupon = (reviewId: number, checked: string | boolean) => {
        if (checked) {
            setSelectedReviews([...selectedReviews, reviewId])
        } else {
            setSelectedReviews(selectedReviews.filter((id) => id !== reviewId))
        }
    }

    const handleDeleteCoupon = (review: Review) => {
        setCouponToAction(review)
        setIsDeleteDialogOpen(true)
    }
    const handleEditCoupon = (review: Review) => {
        setIsEditing(true)
        setCouponToAction(review)
        setIsCouponFormOpen(true)

    }




    const confirmDelete = async () => {

        const res = await deleteApi(`/reviews/${reviewToAction?.documentId}`)
        if (res.success) {

            // toast.success(`Coupon "${reviewToAction?.code}" deleted successfully`)
            setReviews(reviews.filter((review) => review.id !== reviewToAction?.id))
            setIsDeleteDialogOpen(false)
            setCouponToAction(null)
        }
    }

    // const handleBulkDelete = () => {
    //     // In a real app, you would call an API to delete the selected reviews
    //     toast.success(`${selectedReviews.length} reviews deleted successfully`)
    //     setSelectedReviews([])
    // }

    const handleSaveCoupon = async (formData: FormData) => {
        const comment = formData.get("comment") as string
        const approved = formData.get("approved") as string
        const rating = formData.get("rating") as string
        const payload: CreateReview = {
            comment,
            approved: approved === "on" ? true : false,
            product: +selectedProduct,
            user: +selectedUser,
            rating: +rating,
        }

        if (isEditing && reviewToAction) {
            const res = await putApi<{ data: Review }>(`/reviews/${reviewToAction.documentId}`, {
                data: payload
            }, true)
            if (res.success && res.data) {
                toast.success("Coupon added successfully")
                setIsEditing(false)
                setIsCouponFormOpen(false)
                getReviews()
            }

        } else {
            const res = await postApi<{ data: Review }>("/reviews", { data: payload }, true)
            if (res.success && res.data) {
                toast.success("Coupon added successfully")
                setIsCouponFormOpen(false)
                getReviews()
            }
        }
    }

    useEffect(() => {
        initialProudcts("")
        initialUsers("")
    }, [])

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchedQuery(searchTerm);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    useEffect(() => {
        getReviews()
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
                    <h1 className="md:text-3xl font-bold">Reviews</h1>
                    <Button
                        // onClick={() => redirect("/dashboard/products/create")}
                        onClick={() => setIsCouponFormOpen(true)}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        <span className={"hidden md:inline"}>
                            Add Review
                        </span>
                    </Button>
                    <Sheet open={isCouponFormOpen} onOpenChange={setIsCouponFormOpen}>
                        <SheetContent side={isMobile ? "bottom" : "right"}
                            className={isMobile ? "h-[85vh]" : "w-[400px] sm:w-[540px]"}>
                            <SheetHeader>
                                <SheetTitle>Create Review</SheetTitle>
                                <SheetDescription>
                                    Add a new review. Click save when you are done.
                                </SheetDescription>
                            </SheetHeader>

                            <form action={handleSaveCoupon} className="space-y-6 py-6">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="product">Select Product</Label>
                                    <CustomCombobox
                                        onSearch={getProudcts}
                                        value={selectedProduct}
                                        onValueChange={(value) => setSelectedProduct(value)}
                                        emptyText="No Products Found"
                                        debounceMs={400}
                                        enableServerSearch={true}
                                        placeholder="Select Product"
                                        options={products.map(item => ({ value: item.id.toString(), label: item.title }))}
                                        addButtonText={""}
                                        searchPlaceholder={"search"}
                                        minSearchLength={3}
                                        className="scale-z-90"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="user">Select User</Label>
                                    <CustomCombobox
                                        onSearch={getUsers}
                                        value={selectedUser}
                                        onValueChange={(value) => setSeletedUser(value)}
                                        emptyText="No Users Found"
                                        debounceMs={400}
                                        enableServerSearch={true}
                                        placeholder="Select User"
                                        options={users.map(item => ({ value: item.id.toString(), label: item.name || item.username }))}
                                        addButtonText={""}
                                        searchPlaceholder={"search"}
                                        minSearchLength={3}
                                        className="scale-z-90"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="comment">Comment</Label>
                                    <Textarea
                                        id="comment"
                                        name="comment"
                                        {...(isEditing && reviewToAction && { value: reviewToAction.documentId })}
                                        placeholder="Enter review comment"
                                        required
                                        className=""
                                    />
                                </div>


                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="rating">Rating (Max 5)</Label>
                                    <Slider
                                        name="rating"
                                        min={1}
                                        max={5}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="approved">Approve</Label>
                                    <Switch
                                        id=""
                                        name="approved"
                                    // {...(isEditing && reviewToAction && { value: reviewToAction.is_active })}
                                    // checked
                                    />
                                </div>
                                <SheetFooter className="flex flex-col sm:flex-row gap-2">
                                    <Button type="button" variant="outline" onClick={() => setIsCouponFormOpen(false)}
                                        className="w-full sm:w-auto">
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="w-full sm:w-auto">
                                        Save Review
                                    </Button>
                                </SheetFooter>
                            </form>
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="flex justify-between md:flex-row flex-col mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search reviews..."
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
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">
                                        <Checkbox
                                            checked={selectedReviews.length === reviews.length && reviews.length > 0}
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Comment</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead>Approved</TableHead>
                                    <TableHead>Images</TableHead>
                                    <TableHead className="text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reviews.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8">
                                            <div className="flex flex-col items-center justify-center">
                                                <Package className="h-12 w-12 text-gray-300 mb-2" />
                                                <h3 className="text-lg font-medium">No reviews found</h3>
                                                <p className="text-sm text-gray-500 mb-4">
                                                    {searchTerm ? "Try a different search term" : "Add a review to get started"}
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
                                    reviews.map((review: Review) => (
                                        <TableRow key={review.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedReviews.includes(review.id)}
                                                    onCheckedChange={(checked) => handleSelectCoupon(review.id, checked)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium capitalize">{review.user.name || review.user.username}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{review.comment}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{review.product?.title}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{review.rating}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">
                                                    <Badge>
                                                        {review.approved ? "Approved" : "Pending"}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">
                                                    <Dialog>
                                                        <DialogTrigger className="flex items-center gap-1 border-gray-300 border p-1 rounded-md px-2 cursor-pointer">
                                                            <Eye className="size-5" /> Images
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogTitle>Review Images</DialogTitle>
                                                            <div className="grid md:grid-cols-3 gap-2">
                                                                {
                                                                    review?.images?.map(item => {
                                                                        return <Image key={item.id}
                                                                            alt={"review image"}
                                                                            src={mediaUrlGenerator(item.url)}
                                                                            width={200}
                                                                            height={250}
                                                                        />
                                                                    })
                                                                }
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
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
                                                            onClick={() => handleEditCoupon(review)}
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit review
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>View products</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-red-600"
                                                            onClick={() => handleDeleteCoupon(review)}>
                                                            <Trash className="mr-2 h-4 w-4" />
                                                            Delete review
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
                                Are you sure you want to delete this review? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            {reviewToAction && (
                                <div className="flex items-center space-x-4">
                                    <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center">
                                        <Package className="h-6 w-6 text-gray-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium">{reviewToAction.comment}</h4>
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
