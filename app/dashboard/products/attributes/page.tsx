"use client"
import { useEffect, useState } from "react"
import {

    Edit,
    MoreHorizontal, Package,
    Plus,
    Search,
    Trash, X,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, } from "@/components/ui/card"
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
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { VariantAttribute } from "./attribute.type"
import { deleteApi, getApi, postApi, putApi } from "@/lib/api"
import { Tabs, TabsContent, } from "@/components/ui/tabs";
import CustomPagination from "@/components/ui/custom-pagination";
import { MetaResponse } from "@/lib/types/type";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import ManageOptionsModal from "./manage-options-modal"

export default function AttributesPage() {
    const [attributes, setAttributes] = useState<VariantAttribute[]>([])
    const [selectedAttributes, setSelectedAttributes] = useState<number[]>([])
    const [isAttributeFormOpen, setIsAttributeFormOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [attributeToAction, setAttributeToAction] = useState<VariantAttribute | null>()

    const [searchTerm, setSearchTerm] = useState<string>("")
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
    const [viewMode, setViewMode] = useState("attribute")
    const [debouncedSearchedQuery, setDebouncedSearchedQuery] = useState("")

    const [isManageOptionsModalOpen, setIsManageOptionsModalOpen] = useState(false)

    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(50)
    const [meta, setMeta] = useState<MetaResponse>()
    const [isMobile, setIsMobile] = useState(false)

    async function getAttributes() {
        const query = new URLSearchParams();

        query.append("pagination[page]", page.toString());
        query.append("pagination[pageSize]", pageSize.toString());

        if (debouncedSearchedQuery.trim()) query.append("filters[name][$containsi]", debouncedSearchedQuery);

        const res = await getApi<{ data: VariantAttribute[], meta: MetaResponse }>(`/variant-attributes?${query}`, true)
        if (res.success && res.data) {
            setAttributes(res.data?.data)
            setMeta(res.data?.meta)
        }
    }

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedAttributes(attributes.map((variant_attribute) => variant_attribute.id))
        } else {
            setSelectedAttributes([])
        }
    }

    const handleSelectVariantAttribute = (variant_attributeId: number, checked: string | boolean) => {
        if (checked) {
            setSelectedAttributes([...selectedAttributes, variant_attributeId])
        } else {
            setSelectedAttributes(selectedAttributes.filter((id) => id !== variant_attributeId))
        }
    }

    const handleDeleteVariantAttribute = (variant_attribute: VariantAttribute) => {
        setAttributeToAction(variant_attribute)
        setIsDeleteDialogOpen(true)
    }
    const handleEditVariantAttribute = (variant_attribute: VariantAttribute) => {
        setIsEditing(true)
        setAttributeToAction(variant_attribute)
        setIsAttributeFormOpen(true)

    }

    const handleXXXXX = (variant_attribute: VariantAttribute) => {
        setIsEditing(true)
        setAttributeToAction(variant_attribute)
        setIsManageOptionsModalOpen(true)
    }

    const confirmDelete = async () => {
        const res = await deleteApi(`/variant-attributes/${attributeToAction?.documentId}`)
        if (res.success) {

            toast.success(`VariantAttribute "${attributeToAction?.name}" deleted successfully`)
            setAttributes(attributes.filter((variant_attribute) => variant_attribute.id !== attributeToAction?.id))
            setIsDeleteDialogOpen(false)
            setAttributeToAction(null)
        }
    }

    const handleBulkDelete = () => {
        toast.success(`${selectedAttributes.length} variant_attributes deleted successfully`)
        setSelectedAttributes([])
    }

    const handleSaveAttribute = async (formData: FormData) => {
        const name = formData.get("name") as string

        if (isEditing && attributeToAction) {
            const res = await putApi<{ data: VariantAttribute }>(`/variant-attributes/${attributeToAction.documentId}`, {
                data: {
                    name
                }
            }, true)
            if (res.success && res.data) {
                toast.success("Attribute added successfully")
                setAttributes(attributes.map((attribute) => {
                    // @ts-ignore
                    if (attribute.id === res?.data.data.id) {
                        return res.data?.data
                    }
                    return attribute
                }))
                setIsAttributeFormOpen(false)
            }

        } else {
            const res = await postApi<{ data: VariantAttribute }>("/variant-attributes", { data: { name } }, true)
            if (res.success && res.data) {
                toast.success("VariantAttribute added successfully")
                setAttributes([...attributes, res.data.data])
                setIsAttributeFormOpen(false)
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
        getAttributes()
    }, [debouncedSearchedQuery])

    useEffect(() => {
        if (!isAttributeFormOpen) {
            setIsEditing(false)
        }
    }, [isAttributeFormOpen])

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
                    <h1 className="md:text-3xl font-bold">Attributes & Options</h1>
                    <div className="space-x-2">
                        <Button
                            onClick={() => setIsAttributeFormOpen(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            <span className={"hidden md:inline"}>
                                Add Attribute
                            </span>
                        </Button>
                    </div>
                    <Sheet open={isAttributeFormOpen} onOpenChange={setIsAttributeFormOpen}>
                        <SheetContent side={isMobile ? "bottom" : "right"}
                            className={isMobile ? "h-[85vh]" : "w-[400px] sm:w-[540px]"}>
                            <SheetHeader>
                                <SheetTitle>Create New Attribute</SheetTitle>
                                <SheetDescription>
                                    Add a new attribute with a name . Click save when you are done.
                                </SheetDescription>
                            </SheetHeader>

                            <form action={handleSaveAttribute} className="space-y-6 py-6">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="name">Attribute Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        {...(isEditing && attributeToAction && { value: attributeToAction.name })}
                                        placeholder="Enter attribute name"
                                        required
                                    />
                                </div>

                                <SheetFooter className="flex flex-col sm:flex-row gap-2">
                                    <Button type="button" variant="outline" onClick={() => setIsAttributeFormOpen(false)}
                                        className="w-full sm:w-auto">
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="w-full sm:w-auto">
                                        Create Attribute
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
                                    placeholder="Search attributes..."
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

                    <TabsContent value="attribute" className="mt-0">
                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px]">
                                                <Checkbox
                                                    checked={selectedAttributes.length === attributes.length && attributes.length > 0}
                                                    onCheckedChange={handleSelectAll}
                                                />
                                            </TableHead>
                                            <TableHead>
                                                <div className="flex items-center space-x-1">
                                                    <span>Name</span>
                                                </div>
                                            </TableHead>
                                            <TableHead className="">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {attributes.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-8">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <Package className="h-12 w-12 text-gray-300 mb-2" />
                                                        <h3 className="text-lg font-medium">No Attributes found</h3>
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
                                            attributes.map((attribute: VariantAttribute) => (
                                                <TableRow key={attribute.id}>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={selectedAttributes.includes(attribute.id)}
                                                            onCheckedChange={(checked) => handleSelectVariantAttribute(attribute.id, checked)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-medium">{attribute.name}</div>
                                                    </TableCell>
                                                    <TableCell className="">
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
                                                                    onClick={() => handleEditVariantAttribute(attribute)}
                                                                >
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit Attribute
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleXXXXX(attribute)}
                                                                >
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    View Options
                                                                </DropdownMenuItem>
                                                                {/* <DropdownMenuItem>View Attributes</DropdownMenuItem> */}
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="text-red-600"
                                                                    onClick={() => handleDeleteVariantAttribute(attribute)}>
                                                                    <Trash className="mr-2 h-4 w-4" />
                                                                    Delete Attribute
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
                    <TabsContent value="option" className="mt-0">
                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px]">
                                                <Checkbox
                                                    checked={selectedAttributes.length === attributes.length && attributes.length > 0}
                                                    onCheckedChange={handleSelectAll}
                                                />
                                            </TableHead>
                                            <TableHead>
                                                <div className="flex items-center space-x-1">
                                                    <span>Name</span>
                                                </div>
                                            </TableHead>
                                            <TableHead className="">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {attributes.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-8">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <Package className="h-12 w-12 text-gray-300 mb-2" />
                                                        <h3 className="text-lg font-medium">No Attributes found</h3>
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
                                            attributes.map((variant_attribute: VariantAttribute) => (
                                                <TableRow key={variant_attribute.id}>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={selectedAttributes.includes(variant_attribute.id)}
                                                            onCheckedChange={(checked) => handleSelectVariantAttribute(variant_attribute.id, checked)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-medium">{variant_attribute.name}</div>
                                                    </TableCell>
                                                    <TableCell className="">
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
                                                                    onClick={() => handleEditVariantAttribute(variant_attribute)}
                                                                >
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit variant_attribute
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>View Attributes</DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="text-red-600"
                                                                    onClick={() => handleDeleteVariantAttribute(variant_attribute)}>
                                                                    <Trash className="mr-2 h-4 w-4" />
                                                                    Delete variant_attribute
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
                            <DialogTitle>Delete VariantAttribute</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this variant_attribute? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            {attributeToAction && (
                                <div className="flex items-center space-x-4">
                                    <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center">
                                        <Package className="h-6 w-6 text-gray-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium">{attributeToAction.name}</h4>
                                        <p className="text-sm text-gray-500">

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
            {
                attributeToAction && <ManageOptionsModal
                    onClose={() => setIsManageOptionsModalOpen(false)}
                    isOpen={isManageOptionsModalOpen}
                    attribute={attributeToAction}
                />
            }
        </>
    )
}
