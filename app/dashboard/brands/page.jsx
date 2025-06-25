"use client"

import {useState, useEffect} from "react"
import {useRouter} from "next/navigation"
import {Plus, Pencil, Trash2, Search, Grid, List, ArrowUpDown, X, Check, ImageIcon, Upload} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
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
import {FormDescription, FormLabel} from "@/components/ui/form"
import {Textarea} from "@/components/ui/textarea"
import {Switch} from "@/components/ui/switch"
import {Badge} from "@/components/ui/badge"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {useToast} from "@/components/ui/use-toast"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Sample data for brands
const initialBrands = [
    {
        id: 1,
        name: "Nike",
        logo: "/placeholder.svg?height=80&width=80&query=Nike logo",
        description: "Just Do It",
        website: "https://nike.com",
        featured: true,
        productCount: 42,
        createdAt: "2023-01-15",
    },
    {
        id: 2,
        name: "Adidas",
        logo: "/placeholder.svg?height=80&width=80&query=Adidas logo",
        description: "Impossible is Nothing",
        website: "https://adidas.com",
        featured: true,
        productCount: 38,
        createdAt: "2023-01-20",
    },
    {
        id: 3,
        name: "Puma",
        logo: "/placeholder.svg?height=80&width=80&query=Puma logo",
        description: "Forever Faster",
        website: "https://puma.com",
        featured: false,
        productCount: 27,
        createdAt: "2023-02-05",
    },
    {
        id: 4,
        name: "Reebok",
        logo: "/placeholder.svg?height=80&width=80&query=Reebok logo",
        description: "Be More Human",
        website: "https://reebok.com",
        featured: false,
        productCount: 19,
        createdAt: "2023-02-15",
    },
    {
        id: 5,
        name: "Under Armour",
        logo: "/placeholder.svg?height=80&width=80&query=Under Armour logo",
        description: "I Will",
        website: "https://underarmour.com",
        featured: true,
        productCount: 23,
        createdAt: "2023-03-01",
    },
]

export default function BrandsPage() {
    const [brands, setBrands] = useState(initialBrands)
    const [filteredBrands, setFilteredBrands] = useState(initialBrands)
    const [searchQuery, setSearchQuery] = useState("")
    const [viewMode, setViewMode] = useState("list")
    const [sortField, setSortField] = useState("name")
    const [sortDirection, setSortDirection] = useState("asc")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [currentBrand, setCurrentBrand] = useState(null)
    const [newBrand, setNewBrand] = useState({
        name: "",
        logo: "",
        description: "",
        website: "",
        featured: false,
    })
    const {toast} = useToast()
    const router = useRouter()

    // Filter and sort brands when search query or sort options change
    useEffect(() => {
        let result = [...brands]

        // Apply search filter
        if (searchQuery) {
            result = result.filter(
                (brand) =>
                    brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    brand.description.toLowerCase().includes(searchQuery.toLowerCase()),
            )
        }

        // Apply sorting
        result.sort((a, b) => {
            let aValue = a[sortField]
            let bValue = b[sortField]

            if (typeof aValue === "string") {
                aValue = aValue.toLowerCase()
                bValue = bValue.toLowerCase()
            }

            if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
            if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
            return 0
        })

        setFilteredBrands(result)
    }, [brands, searchQuery, sortField, sortDirection])

    // Handle sort toggle
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
    }

    // Handle adding a new brand
    const handleAddBrand = () => {
        const id = Math.max(...brands.map((brand) => brand.id), 0) + 1
        const brandToAdd = {
            ...newBrand,
            id,
            productCount: 0,
            createdAt: new Date().toISOString().split("T")[0],
        }

        setBrands([...brands, brandToAdd])
        setIsAddDialogOpen(false)
        setNewBrand({
            name: "",
            logo: "",
            description: "",
            website: "",
            featured: false,
        })

        toast({
            title: "Brand Added",
            description: `${brandToAdd.name} has been added successfully.`,
        })
    }

    // Handle editing a brand
    const handleEditBrand = () => {
        const updatedBrands = brands.map((brand) => (brand.id === currentBrand.id ? currentBrand : brand))

        setBrands(updatedBrands)
        setIsEditDialogOpen(false)

        toast({
            title: "Brand Updated",
            description: `${currentBrand.name} has been updated successfully.`,
        })
    }

    // Handle deleting a brand
    const handleDeleteBrand = () => {
        const updatedBrands = brands.filter((brand) => brand.id !== currentBrand.id)

        setBrands(updatedBrands)
        setIsDeleteDialogOpen(false)

        toast({
            title: "Brand Deleted",
            description: `${currentBrand.name} has been deleted successfully.`,
            variant: "destructive",
        })
    }

    // Handle toggling featured status
    const handleToggleFeatured = (brand) => {
        const updatedBrands = brands.map((b) => (b.id === brand.id ? {...b, featured: !b.featured} : b))

        setBrands(updatedBrands)

        toast({
            title: brand.featured ? "Brand Unfeatured" : "Brand Featured",
            description: `${brand.name} has been ${brand.featured ? "removed from" : "added to"} featured brands.`,
        })
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Brands</h1>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4"/> Add Brand
                </Button>
            </div>

            {filteredBrands.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mb-4"/>
                    <h3 className="text-lg font-medium">No brands found</h3>
                    <p className="text-muted-foreground mb-4">
                        {searchQuery
                            ? `No brands match "${searchQuery}"`
                            : "There are no brands yet. Add your first brand to get started."}
                    </p>
                    {searchQuery && (
                        <Button variant="outline" onClick={() => setSearchQuery("")}>
                            Clear Search
                        </Button>
                    )}
                </div>
            ) : (
                <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
                    <div className="flex justify-between mb-6 ">
                        <div
                            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
                                <Input
                                    placeholder="Search brands..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <Button
                                        variant="ghost"
                                        className="absolute right-0 top-0 h-full aspect-square rounded-l-none"
                                        onClick={() => setSearchQuery("")}
                                    >
                                        <X className="h-4 w-4"/>
                                    </Button>
                                )}
                            </div>

                            <div className="flex items-center gap-2"></div>
                        </div>
                        <TabsList className="grid w-[200px] grid-cols-2">
                            <TabsTrigger value="list">
                                <List className="h-4 w-4 mr-2"/>
                                List
                            </TabsTrigger>
                            <TabsTrigger value="grid">
                                <Grid className="h-4 w-4 mr-2"/>
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
                                            <TableHead className="w-[80px]">Logo</TableHead>
                                            <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                                                <div className="flex items-center">
                                                    Name
                                                    {sortField === "name" && (
                                                        <ArrowUpDown
                                                            className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`}/>
                                                    )}
                                                </div>
                                            </TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead className="cursor-pointer"
                                                       onClick={() => handleSort("productCount")}>
                                                <div className="flex items-center">
                                                    Products
                                                    {sortField === "productCount" && (
                                                        <ArrowUpDown
                                                            className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`}/>
                                                    )}
                                                </div>
                                            </TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="cursor-pointer"
                                                       onClick={() => handleSort("createdAt")}>
                                                <div className="flex items-center">
                                                    Created
                                                    {sortField === "createdAt" && (
                                                        <ArrowUpDown
                                                            className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`}/>
                                                    )}
                                                </div>
                                            </TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredBrands.map((brand) => (
                                            <TableRow key={brand.id}>
                                                <TableCell>
                                                    <img
                                                        src={brand.logo || "/placeholder.svg"}
                                                        alt={`${brand.name} logo`}
                                                        className="w-10 h-10 object-contain rounded-md"
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">{brand.name}</TableCell>
                                                <TableCell
                                                    className="max-w-[200px] truncate">{brand.description}</TableCell>
                                                <TableCell>{brand.productCount}</TableCell>
                                                <TableCell>
                                                    <Badge variant={brand.featured ? "default" : "outline"}>
                                                        {brand.featured ? "Featured" : "Standard"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{brand.createdAt}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                setCurrentBrand(brand)
                                                                setIsEditDialogOpen(true)
                                                            }}
                                                        >
                                                            <Pencil className="h-4 w-4"/>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                setCurrentBrand(brand)
                                                                setIsDeleteDialogOpen(true)
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4"/>
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="grid" className="mt-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredBrands.map((brand) => (
                                <Card key={brand.id} className="overflow-hidden">
                                    <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg">{brand.name}</CardTitle>
                                            <CardDescription
                                                className="line-clamp-1">{brand.description}</CardDescription>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="h-4 w-4"
                                                    >
                                                        <circle cx="12" cy="12" r="1"/>
                                                        <circle cx="12" cy="5" r="1"/>
                                                        <circle cx="12" cy="19" r="1"/>
                                                    </svg>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator/>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setCurrentBrand(brand)
                                                        setIsEditDialogOpen(true)
                                                    }}
                                                >
                                                    <Pencil className="h-4 w-4 mr-2"/> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleToggleFeatured(brand)}>
                                                    {brand.featured ? (
                                                        <>
                                                            <X className="h-4 w-4 mr-2"/> Unfeature
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Check className="h-4 w-4 mr-2"/> Feature
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => {
                                                        setCurrentBrand(brand)
                                                        setIsDeleteDialogOpen(true)
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2"/> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-2">
                                        <div className="flex justify-center mb-4">
                                            <img
                                                src={brand.logo || "/placeholder.svg"}
                                                alt={`${brand.name} logo`}
                                                className="h-24 w-24 object-contain"
                                            />
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <Badge variant={brand.featured ? "default" : "outline"}>
                                                {brand.featured ? "Featured" : "Standard"}
                                            </Badge>
                                            <span
                                                className="text-sm text-muted-foreground">{brand.productCount} products</span>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0 flex justify-between">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setCurrentBrand(brand)
                                                setIsEditDialogOpen(true)
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => {
                                                setCurrentBrand(brand)
                                                setIsDeleteDialogOpen(true)
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            )}

            {/* Add Brand Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Add New Brand</DialogTitle>
                        <DialogDescription>Create a new brand to organize your products.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <FormLabel htmlFor="name">Brand Name</FormLabel>
                            <Input
                                id="name"
                                value={newBrand.name}
                                onChange={(e) => setNewBrand({...newBrand, name: e.target.value})}
                                placeholder="Enter brand name"
                            />
                        </div>
                        <div className="grid gap-2">
                            <FormLabel htmlFor="logo">Logo URL</FormLabel>
                            <div className="flex gap-2">
                                <Input
                                    id="logo"
                                    value={newBrand.logo}
                                    onChange={(e) => setNewBrand({...newBrand, logo: e.target.value})}
                                    placeholder="Enter logo URL or upload"
                                />
                                <Button variant="outline" size="icon">
                                    <Upload className="h-4 w-4"/>
                                </Button>
                            </div>
                            <FormDescription>Enter a URL or upload an image for the brand logo.</FormDescription>
                        </div>
                        <div className="grid gap-2">
                            <FormLabel htmlFor="description">Description</FormLabel>
                            <Textarea
                                id="description"
                                value={newBrand.description}
                                onChange={(e) => setNewBrand({...newBrand, description: e.target.value})}
                                placeholder="Enter brand description"
                            />
                        </div>
                        <div className="grid gap-2">
                            <FormLabel htmlFor="website">Website</FormLabel>
                            <Input
                                id="website"
                                value={newBrand.website}
                                onChange={(e) => setNewBrand({...newBrand, website: e.target.value})}
                                placeholder="https://example.com"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch
                                id="featured"
                                checked={newBrand.featured}
                                onCheckedChange={(checked) => setNewBrand({...newBrand, featured: checked})}
                            />
                            <FormLabel htmlFor="featured" className="!mt-0">
                                Featured Brand
                            </FormLabel>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddBrand} disabled={!newBrand.name}>
                            Add Brand
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Brand Dialog */}
            {currentBrand && (
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Edit Brand</DialogTitle>
                            <DialogDescription>Update the details for {currentBrand.name}.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <FormLabel htmlFor="edit-name">Brand Name</FormLabel>
                                <Input
                                    id="edit-name"
                                    value={currentBrand.name}
                                    onChange={(e) => setCurrentBrand({...currentBrand, name: e.target.value})}
                                />
                            </div>
                            <div className="grid gap-2">
                                <FormLabel htmlFor="edit-logo">Logo URL</FormLabel>
                                <div className="flex gap-2">
                                    <Input
                                        id="edit-logo"
                                        value={currentBrand.logo}
                                        onChange={(e) => setCurrentBrand({...currentBrand, logo: e.target.value})}
                                    />
                                    <Button variant="outline" size="icon">
                                        <Upload className="h-4 w-4"/>
                                    </Button>
                                </div>
                                <div className="flex justify-center my-2">
                                    <img
                                        src={currentBrand.logo || "/placeholder.svg"}
                                        alt={`${currentBrand.name} logo`}
                                        className="h-20 w-20 object-contain"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <FormLabel htmlFor="edit-description">Description</FormLabel>
                                <Textarea
                                    id="edit-description"
                                    value={currentBrand.description}
                                    onChange={(e) => setCurrentBrand({...currentBrand, description: e.target.value})}
                                />
                            </div>
                            <div className="grid gap-2">
                                <FormLabel htmlFor="edit-website">Website</FormLabel>
                                <Input
                                    id="edit-website"
                                    value={currentBrand.website}
                                    onChange={(e) => setCurrentBrand({...currentBrand, website: e.target.value})}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch
                                    id="edit-featured"
                                    checked={currentBrand.featured}
                                    onCheckedChange={(checked) => setCurrentBrand({...currentBrand, featured: checked})}
                                />
                                <FormLabel htmlFor="edit-featured" className="!mt-0">
                                    Featured Brand
                                </FormLabel>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleEditBrand}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Delete Brand Confirmation */}
            {currentBrand && (
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the brand "{currentBrand.name}" and cannot be undone.
                                {currentBrand.productCount > 0 && (
                                    <span className="block mt-2 font-semibold text-destructive">
                    Warning: This brand has {currentBrand.productCount} products associated with it.
                  </span>
                                )}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={handleDeleteBrand}
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    )
}
