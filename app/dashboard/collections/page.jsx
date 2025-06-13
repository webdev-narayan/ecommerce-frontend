"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Grid,
  List,
  ArrowUpDown,
  X,
  Check,
  ImageIcon,
  Upload,
  Calendar,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { FormDescription, FormLabel } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
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

// Sample data for collections
const initialCollections = [
  {
    id: 1,
    name: "Summer Collection 2024",
    slug: "summer-collection-2024",
    description: "Fresh styles for the hottest season",
    image: "/placeholder.svg?height=200&width=300&query=Summer collection",
    productCount: 45,
    featured: true,
    active: true,
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Winter Essentials",
    slug: "winter-essentials",
    description: "Stay warm and stylish this winter",
    image: "/placeholder.svg?height=200&width=300&query=Winter collection",
    productCount: 38,
    featured: true,
    active: true,
    startDate: "2024-12-01",
    endDate: "2025-02-28",
    createdAt: "2024-01-20",
  },
  {
    id: 3,
    name: "Back to School",
    slug: "back-to-school",
    description: "Everything you need for the new school year",
    image: "/placeholder.svg?height=200&width=300&query=School collection",
    productCount: 27,
    featured: false,
    active: true,
    startDate: "2024-08-01",
    endDate: "2024-09-30",
    createdAt: "2024-02-05",
  },
  {
    id: 4,
    name: "Holiday Special",
    slug: "holiday-special",
    description: "Celebrate the season with our holiday collection",
    image: "/placeholder.svg?height=200&width=300&query=Holiday collection",
    productCount: 52,
    featured: true,
    active: false,
    startDate: "2024-11-15",
    endDate: "2024-12-31",
    createdAt: "2024-02-15",
  },
  {
    id: 5,
    name: "Spring Refresh",
    slug: "spring-refresh",
    description: "Refresh your wardrobe for spring",
    image: "/placeholder.svg?height=200&width=300&query=Spring collection",
    productCount: 33,
    featured: false,
    active: true,
    startDate: "2024-03-01",
    endDate: "2024-05-31",
    createdAt: "2024-03-01",
  },
]

export default function CollectionsPage() {
  const [collections, setCollections] = useState(initialCollections)
  const [filteredCollections, setFilteredCollections] = useState(initialCollections)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("list")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentCollection, setCurrentCollection] = useState(null)
  const [newCollection, setNewCollection] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    featured: false,
    active: true,
    startDate: "",
    endDate: "",
  })
  const { toast } = useToast()
  const router = useRouter()

  // Filter and sort collections when search query or sort options change
  useEffect(() => {
    let result = [...collections]

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (collection) =>
          collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          collection.description.toLowerCase().includes(searchQuery.toLowerCase()),
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

    setFilteredCollections(result)
  }, [collections, searchQuery, sortField, sortDirection])

  // Auto-generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
  }

  // Handle sort toggle
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Handle adding a new collection
  const handleAddCollection = () => {
    const id = Math.max(...collections.map((collection) => collection.id), 0) + 1
    const collectionToAdd = {
      ...newCollection,
      id,
      slug: newCollection.slug || generateSlug(newCollection.name),
      productCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setCollections([...collections, collectionToAdd])
    setIsAddDialogOpen(false)
    setNewCollection({
      name: "",
      slug: "",
      description: "",
      image: "",
      featured: false,
      active: true,
      startDate: "",
      endDate: "",
    })

    toast({
      title: "Collection Added",
      description: `${collectionToAdd.name} has been added successfully.`,
    })
  }

  // Handle editing a collection
  const handleEditCollection = () => {
    const updatedCollections = collections.map((collection) =>
      collection.id === currentCollection.id ? currentCollection : collection,
    )

    setCollections(updatedCollections)
    setIsEditDialogOpen(false)

    toast({
      title: "Collection Updated",
      description: `${currentCollection.name} has been updated successfully.`,
    })
  }

  // Handle deleting a collection
  const handleDeleteCollection = () => {
    const updatedCollections = collections.filter((collection) => collection.id !== currentCollection.id)

    setCollections(updatedCollections)
    setIsDeleteDialogOpen(false)

    toast({
      title: "Collection Deleted",
      description: `${currentCollection.name} has been deleted successfully.`,
      variant: "destructive",
    })
  }

  // Handle toggling featured status
  const handleToggleFeatured = (collection) => {
    const updatedCollections = collections.map((c) => (c.id === collection.id ? { ...c, featured: !c.featured } : c))

    setCollections(updatedCollections)

    toast({
      title: collection.featured ? "Collection Unfeatured" : "Collection Featured",
      description: `${collection.name} has been ${collection.featured ? "removed from" : "added to"} featured collections.`,
    })
  }

  // Handle toggling active status
  const handleToggleActive = (collection) => {
    const updatedCollections = collections.map((c) => (c.id === collection.id ? { ...c, active: !c.active } : c))

    setCollections(updatedCollections)

    toast({
      title: collection.active ? "Collection Deactivated" : "Collection Activated",
      description: `${collection.name} has been ${collection.active ? "deactivated" : "activated"}.`,
    })
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Collections</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Collection
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search collections..."
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
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {filteredCollections.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
          <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No collections found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? `No collections match "${searchQuery}"`
              : "There are no collections yet. Add your first collection to get started."}
          </p>
          {searchQuery && (
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
          <div className="flex justify-end mb-4">
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
                      <TableHead className="w-[100px]">Image</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                        <div className="flex items-center">
                          Name
                          {sortField === "name" && (
                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("productCount")}>
                        <div className="flex items-center">
                          Products
                          {sortField === "productCount" && (
                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCollections.map((collection) => (
                      <TableRow key={collection.id}>
                        <TableCell>
                          <img
                            src={collection.image || "/placeholder.svg"}
                            alt={`${collection.name} image`}
                            className="w-16 h-12 object-cover rounded-md"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{collection.name}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{collection.description}</TableCell>
                        <TableCell>{collection.productCount}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge variant={collection.active ? "default" : "secondary"}>
                              {collection.active ? "Active" : "Inactive"}
                            </Badge>
                            {collection.featured && <Badge variant="outline">Featured</Badge>}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex flex-col">
                            <span>{collection.startDate}</span>
                            <span className="text-muted-foreground">to</span>
                            <span>{collection.endDate}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setCurrentCollection(collection)
                                setIsEditDialogOpen(true)
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setCurrentCollection(collection)
                                setIsDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
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
              {filteredCollections.map((collection) => (
                <Card key={collection.id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={collection.image || "/placeholder.svg"}
                      alt={`${collection.name} image`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      {collection.active && <Badge>Active</Badge>}
                      {collection.featured && <Badge variant="secondary">Featured</Badge>}
                    </div>
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg">{collection.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{collection.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">{collection.productCount} products</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <Calendar className="inline h-3 w-3 mr-1" />
                      {collection.startDate} - {collection.endDate}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setCurrentCollection(collection)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleActive(collection)}>
                          {collection.active ? (
                            <>
                              <X className="h-4 w-4 mr-2" /> Deactivate
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-2" /> Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleFeatured(collection)}>
                          {collection.featured ? (
                            <>
                              <X className="h-4 w-4 mr-2" /> Unfeature
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-2" /> Feature
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => {
                            setCurrentCollection(collection)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Add Collection Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Collection</DialogTitle>
            <DialogDescription>Create a new collection to organize your products.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <FormLabel htmlFor="name">Collection Name</FormLabel>
              <Input
                id="name"
                value={newCollection.name}
                onChange={(e) => {
                  setNewCollection({
                    ...newCollection,
                    name: e.target.value,
                    slug: generateSlug(e.target.value),
                  })
                }}
                placeholder="Enter collection name"
              />
            </div>
            <div className="grid gap-2">
              <FormLabel htmlFor="slug">URL Slug</FormLabel>
              <Input
                id="slug"
                value={newCollection.slug}
                onChange={(e) => setNewCollection({ ...newCollection, slug: e.target.value })}
                placeholder="collection-url-slug"
              />
              <FormDescription>This will be used in the collection URL.</FormDescription>
            </div>
            <div className="grid gap-2">
              <FormLabel htmlFor="image">Banner Image</FormLabel>
              <div className="flex gap-2">
                <Input
                  id="image"
                  value={newCollection.image}
                  onChange={(e) => setNewCollection({ ...newCollection, image: e.target.value })}
                  placeholder="Enter image URL or upload"
                />
                <Button variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <FormLabel htmlFor="description">Description</FormLabel>
              <Textarea
                id="description"
                value={newCollection.description}
                onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                placeholder="Enter collection description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <FormLabel htmlFor="startDate">Start Date</FormLabel>
                <Input
                  id="startDate"
                  type="date"
                  value={newCollection.startDate}
                  onChange={(e) => setNewCollection({ ...newCollection, startDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <FormLabel htmlFor="endDate">End Date</FormLabel>
                <Input
                  id="endDate"
                  type="date"
                  value={newCollection.endDate}
                  onChange={(e) => setNewCollection({ ...newCollection, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="active"
                  checked={newCollection.active}
                  onCheckedChange={(checked) => setNewCollection({ ...newCollection, active: checked })}
                />
                <FormLabel htmlFor="active" className="!mt-0">
                  Active
                </FormLabel>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="featured"
                  checked={newCollection.featured}
                  onCheckedChange={(checked) => setNewCollection({ ...newCollection, featured: checked })}
                />
                <FormLabel htmlFor="featured" className="!mt-0">
                  Featured
                </FormLabel>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCollection} disabled={!newCollection.name}>
              Add Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Collection Dialog */}
      {currentCollection && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Collection</DialogTitle>
              <DialogDescription>Update the details for {currentCollection.name}.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <FormLabel htmlFor="edit-name">Collection Name</FormLabel>
                <Input
                  id="edit-name"
                  value={currentCollection.name}
                  onChange={(e) => {
                    setCurrentCollection({
                      ...currentCollection,
                      name: e.target.value,
                      slug: generateSlug(e.target.value),
                    })
                  }}
                />
              </div>
              <div className="grid gap-2">
                <FormLabel htmlFor="edit-slug">URL Slug</FormLabel>
                <Input
                  id="edit-slug"
                  value={currentCollection.slug}
                  onChange={(e) => setCurrentCollection({ ...currentCollection, slug: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <FormLabel htmlFor="edit-image">Banner Image</FormLabel>
                <div className="flex gap-2">
                  <Input
                    id="edit-image"
                    value={currentCollection.image}
                    onChange={(e) => setCurrentCollection({ ...currentCollection, image: e.target.value })}
                  />
                  <Button variant="outline" size="icon">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                {currentCollection.image && (
                  <div className="mt-2">
                    <img
                      src={currentCollection.image || "/placeholder.svg"}
                      alt={`${currentCollection.name} image`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <FormLabel htmlFor="edit-description">Description</FormLabel>
                <Textarea
                  id="edit-description"
                  value={currentCollection.description}
                  onChange={(e) => setCurrentCollection({ ...currentCollection, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <FormLabel htmlFor="edit-startDate">Start Date</FormLabel>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={currentCollection.startDate}
                    onChange={(e) => setCurrentCollection({ ...currentCollection, startDate: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <FormLabel htmlFor="edit-endDate">End Date</FormLabel>
                  <Input
                    id="edit-endDate"
                    type="date"
                    value={currentCollection.endDate}
                    onChange={(e) => setCurrentCollection({ ...currentCollection, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="edit-active"
                    checked={currentCollection.active}
                    onCheckedChange={(checked) => setCurrentCollection({ ...currentCollection, active: checked })}
                  />
                  <FormLabel htmlFor="edit-active" className="!mt-0">
                    Active
                  </FormLabel>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="edit-featured"
                    checked={currentCollection.featured}
                    onCheckedChange={(checked) => setCurrentCollection({ ...currentCollection, featured: checked })}
                  />
                  <FormLabel htmlFor="edit-featured" className="!mt-0">
                    Featured
                  </FormLabel>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditCollection}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Collection Confirmation */}
      {currentCollection && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the collection "{currentCollection.name}" and cannot be undone.
                {currentCollection.productCount > 0 && (
                  <span className="block mt-2 font-semibold text-destructive">
                    Warning: This collection has {currentCollection.productCount} products associated with it.
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleDeleteCollection}
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
