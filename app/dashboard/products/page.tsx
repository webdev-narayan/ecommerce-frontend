"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Edit, Grid, List, MoreHorizontal, MoreVertical, Package, Plus, Search, Trash2, X, } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { redirect } from "next/navigation"
import { Tabs, TabsTrigger, TabsList } from '@/components/ui/tabs';
import { TabsContent } from '@/components/ui/tabs';
import Image from "next/image"
import { Badge } from '@/components/ui/badge';
import { getApi } from "@/lib/api"
import { Product } from './product.type';
import { mediaUrlGenerator } from "@/lib/utils";
import CustomPagination from "@/components/ui/custom-pagination";
import { MetaResponse } from "@/lib/types/type";

export default function ProductsPage() {
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [selectedProducts, setSelectedProducts] = useState<number[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [isAddProductOpen, setIsAddProductOpen] = useState<boolean>(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
    const [productToDelete, setProductToDelete] = useState<Product | null>(null)
    const [viewMode, setViewMode] = useState("list")
    const [debouncedSearchedQuery, setDebouncedSearchedQuery] = useState("")
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    const [meta, setMeta] = useState<MetaResponse>()

    const getProducts = async () => {
        let query = new URLSearchParams();
        query.append("populate", "*");
        if (debouncedSearchedQuery.trim()) {
            query.append("filters[title][$containsi]", debouncedSearchedQuery);
        }

        const res = await getApi<{ data: Product[], meta: MetaResponse }>(`/products?${query.toString()}`, true)
        if (res.success && res.data) {
            setProducts(res.data?.data)
            setMeta(res.data?.meta)
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
        getProducts()
    }, [debouncedSearchedQuery])

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedProducts(products.map((product: Product) => product.id))
        } else {
            setSelectedProducts([])
        }
    }

    const handleSelectProduct = (productId: number, checked: boolean | string) => {
        if (checked) {
            setSelectedProducts([...selectedProducts, productId])
        } else {
            setSelectedProducts(selectedProducts.filter((id) => id !== productId))
        }
    }

    const handleDeleteProduct = (product: Product) => {
        setProductToDelete(product)
        setIsDeleteDialogOpen(true)
    }

    const confirmDelete = () => {
        // In a real app, you would call an API to delete the product
        toast.success(`Product "${productToDelete?.title}" deleted successfully`)
        setIsDeleteDialogOpen(false)
        setProductToDelete(null)
    }

    const handleBulkDelete = () => {
        // In a real app, you would call an API to delete the selected products
        toast.success(`${selectedProducts.length} products deleted successfully`)
        setSelectedProducts([])
    }

    const handleAddProduct = (e: FormDataEvent) => {
        e.preventDefault()
        // In a real app, you would call an API to add the product
        toast.success("Product added successfully")
        setIsAddProductOpen(false)
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Products</h1>
                <Button
                    onClick={() => redirect("/dashboard/products/create")}
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
            </div>

            <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
                <div className="flex justify-between mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
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
                                                checked={selectedProducts.length === products.length && products.length > 0}
                                                onCheckedChange={handleSelectAll}
                                            />
                                        </TableHead>
                                        <TableHead>
                                            <div className="flex items-center space-x-1">
                                                <span>Product</span>
                                            </div>
                                        </TableHead>
                                        <TableHead>
                                            <div className="flex items-center space-x-1">
                                                <span>Category</span>
                                            </div>
                                        </TableHead>
                                        <TableHead>
                                            <div className="flex items-center space-x-1">
                                                <span>Price</span>
                                            </div>
                                        </TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8">
                                                <div className="flex flex-col items-center justify-center">
                                                    <Package className="h-12 w-12 text-gray-300 mb-2" />
                                                    <h3 className="text-lg font-medium">No products found</h3>
                                                    <p className="text-sm text-gray-500 mb-4">
                                                        {searchTerm ? "Try a different search term" : "Add a product to get started"}
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
                                        products.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedProducts.includes(product.id)}
                                                        onCheckedChange={(checked) => handleSelectProduct(product.id, checked)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{product.title}</div>
                                                </TableCell>
                                                <TableCell>{product.category?.name}</TableCell>
                                                <TableCell>₹ {product?.product_variants[0].price}</TableCell>
                                                <TableCell>
                                                    <div
                                                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${product.status === "In Stock"
                                                            ? "bg-green-100 text-green-800"
                                                            : product.status === "Low Stock"
                                                                ? "bg-yellow-100 text-yellow-800"
                                                                : "bg-red-100 text-red-800"
                                                            }`}
                                                    >
                                                        <Package className="h-4 w-4 mr-1" />
                                                        {product?.stock}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                                <span className="sr-only">Actions</span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem>
                                                                <Link href={`/dashboard/products/${product.id}`}
                                                                    className="flex w-full">
                                                                    View details
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>Edit product</DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-red-600"
                                                                onClick={() => handleDeleteProduct(product)}>
                                                                Delete product
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
                        {products.length > 0 ? products.map((product) => (
                            <Card
                                key={product.id}
                                className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white"
                            >
                                <CardHeader className="p-0">
                                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                                        <Image
                                            src={mediaUrlGenerator(product?.thumbnail?.url)}
                                            alt={product.title}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute top-3 right-3">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-4">
                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between">
                                            <h3 className="font-semibold text-gray-900 line-clamp-1">{product.title}</h3>
                                            <Badge variant="secondary"
                                                className="ml-2 bg-gray-100 text-gray-700 hover:bg-gray-100">
                                                {product?.category?.name}
                                            </Badge>
                                        </div>
                                        {/* <p className="text-sm text-gray-600 line-clamp-2">{product.name}</p> */}
                                        <div className="flex items-center justify-between pt-2">
                                            <span className="text-lg font-bold text-gray-900">{product.price}</span>
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <div
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${product.status === "In Stock"
                                                        ? "bg-green-100 text-green-800"
                                                        : product.status === "Low Stock"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    <Package className="h-4 w-4 mr-1" />
                                                    <span>{product?.stock}</span>
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
                                        onClick={() => handleDeleteProduct(product)}
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
                                <h3 className="text-lg font-medium">No products found</h3>
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
                        <DialogTitle>Delete Product</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this product? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        {productToDelete && (
                            <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center">
                                    <Package className="h-6 w-6 text-gray-500" />
                                </div>
                                <div>
                                    <h4 className="font-medium">{productToDelete.title}</h4>
                                    <p className="text-sm text-gray-500">
                                        ${productToDelete.price.toFixed(2)} • {productToDelete.category?.name}
                                    </p>
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
    )
}
