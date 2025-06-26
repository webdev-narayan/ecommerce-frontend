"use client"

import { useEffect, useState } from "react"
import { Edit, MoreHorizontal, Package, Pencil, Plus, Search, Trash, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { getApi } from "@/lib/api"
import { VariantAttribute, VariantOption } from "./attribute.type"


interface ManageOptionsModalProps {
    isOpen: boolean
    onClose: () => void
    attribute: VariantAttribute | null
}

export default function ManageOptionsModal({ isOpen, onClose, attribute }: ManageOptionsModalProps) {
    const [options, setOptions] = useState<VariantOption[]>([])
    const [selectedOptions, setSelectedOptions] = useState<number[]>([])
    const [isOptionFormOpen, setIsOptionFormOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [optionToAction, setOptionToAction] = useState<VariantOption | null>(null)
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
    const [isMobile, setIsMobile] = useState(false)

    const filteredOptions = options.filter(
        (option) =>
            option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            option?.property?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedOptions(filteredOptions.map((option) => option.id))
        } else {
            setSelectedOptions([])
        }
    }

    const handleSelectOption = (optionId: number, checked: string | boolean) => {
        if (checked) {
            setSelectedOptions([...selectedOptions, optionId])
        } else {
            setSelectedOptions(selectedOptions.filter((id) => id !== optionId))
        }
    }

    const handleDeleteOption = (option: VariantOption) => {
        setOptionToAction(option)
        setIsDeleteDialogOpen(true)
    }

    const handleEditOption = (option: VariantOption) => {
        setIsEditing(true)
        setOptionToAction(option)
        setIsOptionFormOpen(true)
    }

    const confirmDelete = async () => {
        // Replace with actual API call
        toast.success(`Option "${optionToAction?.name}" deleted successfully`)
        setOptions(options.filter((option) => option.id !== optionToAction?.id))
        setIsDeleteDialogOpen(false)
        setOptionToAction(null)
    }

    const handleBulkDelete = async () => {
        // Replace with actual API call
        toast.success(`${selectedOptions.length} options deleted successfully`)
        setOptions(options.filter((option) => !selectedOptions.includes(option.id)))
        setSelectedOptions([])
    }

    const handleSaveOption = async (formData: FormData) => {
        const name = formData.get("name") as string
        const value = formData.get("value") as string

        if (isEditing && optionToAction) {
            // Replace with actual API call
            const updatedOption = {
                ...optionToAction,
                name,
                value,
                updatedAt: new Date().toISOString(),
            }
            setOptions(options.map((option) => (option.id === optionToAction.id ? updatedOption : option)))
            toast.success("Option updated successfully")
        } else {
            // Replace with actual API call
            // const newOption: VariantOption = {
            //     id: Date.now(),
            //     documentId: `opt${Date.now()}`,
            //     name,
            //     property,
            // }
            // setOptions([...options, newOption])
            // toast.success("Option added successfully")
        }
        setIsOptionFormOpen(false)
        setIsEditing(false)
        setOptionToAction(null)
    }

    const getOptions = async () => {
        const query = new URLSearchParams();
        query.append("pagination[pageSize]", "100")
        query.append("pagination[page]", "1")
        query.append(`filters[variant_attribute][id][$eq]`, attribute?.id.toString() || "")
        const res = await getApi<{ data: VariantOption[] }>("/variant-options?" + query?.toString(), true)
        if (res.success && res.data) {
            setOptions(res.data.data)
        }

    }

    useEffect(() => {
        if (isOpen && attribute) {
            // Load options for the selected attribute
            getOptions()
        }
    }, [isOpen, attribute])

    useEffect(() => {
        if (!isOptionFormOpen) {
            setIsEditing(false)
            setOptionToAction(null)
        }
    }, [isOptionFormOpen])

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkScreenSize()
        window.addEventListener("resize", checkScreenSize)
        return () => window.removeEventListener("resize", checkScreenSize)
    }, [])

    if (!isOpen || !attribute) return null

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Manage Options - {attribute.name}</DialogTitle>
                        <DialogDescription>Add, edit, or delete options for the {attribute.name} attribute.</DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 flex-1 overflow-hidden p-2">
                        {/* Header Actions */}
                        <div className="flex justify-between items-center">
                            <div className="relative w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search options..."
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
                            <div className="flex gap-2">
                                {selectedOptions.length > 0 && (
                                    <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                                        <Trash className="mr-2 h-4 w-4" />
                                        Delete Selected ({selectedOptions.length})
                                    </Button>
                                )}
                                <Button onClick={() => setIsOptionFormOpen(true)} size="sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Option
                                </Button>
                            </div>
                        </div>

                        {/* Options Table */}
                        <Card className="flex-1 overflow-hidden">
                            <CardContent className="p-0 h-full overflow-auto">

                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px]">
                                                <Checkbox
                                                    checked={selectedOptions.length === filteredOptions.length && filteredOptions.length > 0}
                                                    onCheckedChange={handleSelectAll}
                                                />
                                            </TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Property</TableHead>
                                            <TableHead className="w-[100px]">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredOptions.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center py-8">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <Package className="h-12 w-12 text-gray-300 mb-2" />
                                                        <h3 className="text-lg font-medium">No Options found</h3>
                                                        <p className="text-sm text-gray-500 mb-4">
                                                            {searchTerm ? "Try a different search term" : "Add an option to get started"}
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
                                            filteredOptions.map((option: VariantOption) => (
                                                <TableRow key={option.id}>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={selectedOptions.includes(option.id)}
                                                            onCheckedChange={(checked) => handleSelectOption(option.id, checked)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-medium">{option.name}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            {option?.property?.startsWith("#") ? (
                                                                <div className="w-4 h-4 rounded border" style={{ backgroundColor: option.property }} />
                                                            ) : null}
                                                            <span className="text-sm text-muted-foreground">{option.property}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                    <span className="sr-only">Actions</span>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuItem onClick={() => handleEditOption(option)}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit Option
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteOption(option)}>
                                                                    <Trash className="mr-2 h-4 w-4" />
                                                                    Delete Option
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
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Option Form Sheet */}
            <Sheet open={isOptionFormOpen} onOpenChange={setIsOptionFormOpen}>
                <SheetContent side={isMobile ? "bottom" : "right"} className={isMobile ? "h-[85vh]" : "w-[400px] sm:w-[540px]"}>
                    <SheetHeader>
                        <SheetTitle>{isEditing ? "Edit Option" : "Create New Option"}</SheetTitle>
                        <SheetDescription>
                            {isEditing ? "Update the option details below." : `Add a new option for the ${attribute.name} attribute.`}
                        </SheetDescription>
                    </SheetHeader>

                    <form action={handleSaveOption} className="space-y-6 py-6">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Option Name</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={isEditing && optionToAction ? optionToAction.name : ""}
                                placeholder="Enter option name (e.g., Red, Large, Cotton)"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="value">Option Value</Label>
                            <Input
                                id="value"
                                name="value"
                                defaultValue={isEditing && optionToAction ? optionToAction?.property : ""}
                                placeholder="Enter option value (e.g., #FF0000, XL, cotton-blend)"
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                For colors, use hex codes (e.g., #FF0000). For other attributes, use descriptive values.
                            </p>
                        </div>

                        <SheetFooter className="flex flex-col sm:flex-row gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOptionFormOpen(false)}
                                className="w-full sm:w-auto"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="w-full sm:w-auto">
                                {isEditing ? "Update Option" : "Create Option"}
                            </Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete Option</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this option? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        {optionToAction && (
                            <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center">
                                    {optionToAction?.property?.startsWith("#") ? (
                                        <div
                                            className="w-8 h-8 rounded border-2 border-white shadow-sm"
                                            style={{ backgroundColor: optionToAction.property }}
                                        />
                                    ) : (
                                        <Package className="h-6 w-6 text-gray-500" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-medium">{optionToAction.name}</h4>
                                    <p className="text-sm text-gray-500">Value: {optionToAction.property}</p>
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
        </>
    )
}
