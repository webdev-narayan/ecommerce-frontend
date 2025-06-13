"use client"

import { useState } from "react"
import Image from "next/image"
import {
  ArrowUpDown,
  ChevronDown,
  Download,
  Edit,
  Eye,
  Filter,
  ImageIcon,
  LinkIcon,
  MoreHorizontal,
  Plus,
  Search,
  Trash,
  Upload,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

// Sample banner data
const initialBanners = [
  {
    id: 1,
    title: "Summer Sale",
    description: "Up to 50% off on summer collection",
    image: "summer sale banner",
    position: "Hero",
    url: "/collections/summer-sale",
    active: true,
    startDate: "2024-06-01",
    endDate: "2024-08-31",
  },
  {
    id: 2,
    title: "New Arrivals",
    description: "Check out our latest products",
    image: "new arrivals banner",
    position: "Home Page",
    url: "/collections/new-arrivals",
    active: true,
    startDate: "2024-05-15",
    endDate: "2024-12-31",
  },
  {
    id: 3,
    title: "Free Shipping",
    description: "Free shipping on orders over $50",
    image: "free shipping banner",
    position: "Sidebar",
    url: "/shipping-policy",
    active: true,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
  },
  {
    id: 4,
    title: "Holiday Special",
    description: "Special offers for the holiday season",
    image: "holiday special banner",
    position: "Home Page",
    url: "/collections/holiday-special",
    active: false,
    startDate: "2024-11-15",
    endDate: "2024-12-31",
  },
  {
    id: 5,
    title: "Flash Sale",
    description: "24-hour flash sale on selected items",
    image: "flash sale banner",
    position: "Category Pages",
    url: "/flash-sale",
    active: false,
    startDate: "2024-07-15",
    endDate: "2024-07-16",
  },
]

export default function BannersPage() {
  const [banners, setBanners] = useState(initialBanners)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBanners, setSelectedBanners] = useState([])
  const [isAddBannerOpen, setIsAddBannerOpen] = useState(false)
  const [isEditBannerOpen, setIsEditBannerOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
  const [bannerToEdit, setBannerToEdit] = useState(null)
  const [bannerToDelete, setBannerToDelete] = useState(null)
  const [bannerToPreview, setBannerToPreview] = useState(null)
  const [newBanner, setNewBanner] = useState({
    title: "",
    description: "",
    image: "",
    position: "Home Page",
    url: "",
    active: true,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split("T")[0],
  })

  // Filter banners based on search term
  const filteredBanners = banners.filter(
    (banner) =>
      banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      banner.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      banner.position.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedBanners(filteredBanners.map((banner) => banner.id))
    } else {
      setSelectedBanners([])
    }
  }

  const handleSelectBanner = (bannerId, checked) => {
    if (checked) {
      setSelectedBanners([...selectedBanners, bannerId])
    } else {
      setSelectedBanners(selectedBanners.filter((id) => id !== bannerId))
    }
  }

  const handleDeleteBanner = (banner) => {
    setBannerToDelete(banner)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    setBanners(banners.filter((banner) => banner.id !== bannerToDelete.id))
    toast.success(`Banner "${bannerToDelete.title}" deleted successfully`)
    setIsDeleteDialogOpen(false)
    setBannerToDelete(null)
  }

  const handleBulkDelete = () => {
    setBanners(banners.filter((banner) => !selectedBanners.includes(banner.id)))
    toast.success(`${selectedBanners.length} banners deleted successfully`)
    setSelectedBanners([])
  }

  const handleAddBanner = (e) => {
    e.preventDefault()
    const newId = Math.max(...banners.map((banner) => banner.id), 0) + 1
    setBanners([...banners, { ...newBanner, id: newId }])
    toast.success("Banner added successfully")
    setIsAddBannerOpen(false)
    setNewBanner({
      title: "",
      description: "",
      image: "",
      position: "Home Page",
      url: "",
      active: true,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split("T")[0],
    })
  }

  const handleEditBanner = (e) => {
    e.preventDefault()
    setBanners(banners.map((banner) => (banner.id === bannerToEdit.id ? bannerToEdit : banner)))
    toast.success(`Banner "${bannerToEdit.title}" updated successfully`)
    setIsEditBannerOpen(false)
    setBannerToEdit(null)
  }

  const handleToggleActive = (bannerId, active) => {
    setBanners(
      banners.map((banner) => {
        if (banner.id === bannerId) {
          return { ...banner, active }
        }
        return banner
      }),
    )
    toast.success(`Banner ${active ? "activated" : "deactivated"} successfully`)
  }

  const openEditDialog = (banner) => {
    setBannerToEdit({ ...banner })
    setIsEditBannerOpen(true)
  }

  const openPreviewDialog = (banner) => {
    setBannerToPreview(banner)
    setIsPreviewDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Banners</h1>
          <p className="text-gray-500">Manage promotional banners for your store.</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isAddBannerOpen} onOpenChange={setIsAddBannerOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Banner
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Banner</DialogTitle>
                <DialogDescription>Create a new promotional banner for your store.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddBanner}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={newBanner.title}
                      onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={newBanner.description}
                      onChange={(e) => setNewBanner({ ...newBanner, description: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="position" className="text-right">
                      Position
                    </Label>
                    <Select
                      value={newBanner.position}
                      onValueChange={(value) => setNewBanner({ ...newBanner, position: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hero">Hero</SelectItem>
                        <SelectItem value="Home Page">Home Page</SelectItem>
                        <SelectItem value="Sidebar">Sidebar</SelectItem>
                        <SelectItem value="Category Pages">Category Pages</SelectItem>
                        <SelectItem value="Product Pages">Product Pages</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="url" className="text-right">
                      URL
                    </Label>
                    <Input
                      id="url"
                      value={newBanner.url}
                      onChange={(e) => setNewBanner({ ...newBanner, url: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startDate" className="text-right">
                      Start Date
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newBanner.startDate}
                      onChange={(e) => setNewBanner({ ...newBanner, startDate: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endDate" className="text-right">
                      End Date
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newBanner.endDate}
                      onChange={(e) => setNewBanner({ ...newBanner, endDate: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="active" className="text-right">
                      Active
                    </Label>
                    <div className="flex items-center space-x-2 col-span-3">
                      <Switch
                        id="active"
                        checked={newBanner.active}
                        onCheckedChange={(checked) => setNewBanner({ ...newBanner, active: checked })}
                      />
                      <Label htmlFor="active">{newBanner.active ? "Banner is active" : "Banner is inactive"}</Label>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="image" className="text-right">
                      Banner Image
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
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 2MB)</p>
                          </div>
                          <input
                            id="dropzone-file"
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              // In a real app, you would upload the file to a server
                              // For this demo, we'll just set a placeholder
                              if (e.target.files && e.target.files[0]) {
                                setNewBanner({
                                  ...newBanner,
                                  image: e.target.files[0].name,
                                })
                              }
                            }}
                          />
                        </label>
                      </div>
                      {newBanner.image && <p className="mt-2 text-sm text-gray-500">Selected: {newBanner.image}</p>}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddBannerOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Banner</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Banner Management</CardTitle>
              <CardDescription>You have {banners.length} banners in your store.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Search banners..."
                      className="pl-8 w-full md:w-[300px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Checkbox id="active-filter" className="mr-2" />
                        <label htmlFor="active-filter">Active Only</label>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Checkbox id="position-filter" className="mr-2" />
                        <label htmlFor="position-filter">Position</label>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Button variant="outline" size="sm" className="w-full">
                          Apply Filters
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  {selectedBanners.length > 0 && (
                    <Button variant="outline" size="sm" onClick={handleBulkDelete}>
                      <Trash className="mr-2 h-4 w-4" />
                      Delete Selected
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={selectedBanners.length === filteredBanners.length && filteredBanners.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center space-x-1">
                          <span>Banner</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>
                        <div className="flex items-center space-x-1">
                          <span>Dates</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBanners.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center">
                            <ImageIcon className="h-12 w-12 text-gray-300 mb-2" />
                            <h3 className="text-lg font-medium">No banners found</h3>
                            <p className="text-sm text-gray-500 mb-4">
                              {searchTerm ? "Try a different search term" : "Add a banner to get started"}
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
                      filteredBanners.map((banner) => (
                        <TableRow key={banner.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedBanners.includes(banner.id)}
                              onCheckedChange={(checked) => handleSelectBanner(banner.id, checked)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-16 bg-gray-100 rounded overflow-hidden relative">
                                <Image
                                  src={`/placeholder.svg?height=40&width=64&query=${banner.image}`}
                                  alt={banner.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium">{banner.title}</div>
                                <div className="text-xs text-gray-500 truncate max-w-[200px]">{banner.description}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{banner.position}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1 text-sm">
                              <LinkIcon className="h-3 w-3 text-gray-500" />
                              <span className="truncate max-w-[150px]">{banner.url}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{new Date(banner.startDate).toLocaleDateString()}</div>
                              <div className="text-gray-500">to {new Date(banner.endDate).toLocaleDateString()}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={banner.active}
                                onCheckedChange={(checked) => handleToggleActive(banner.id, checked)}
                                size="sm"
                              />
                              <span className={`text-sm ${banner.active ? "text-green-600" : "text-gray-500"}`}>
                                {banner.active ? "Active" : "Inactive"}
                              </span>
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
                                <DropdownMenuItem onClick={() => openPreviewDialog(banner)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Preview
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEditDialog(banner)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit banner
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteBanner(banner)}>
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete banner
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  Showing {filteredBanners.length} of {banners.length} banners
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBanners.map((banner) => (
              <Card key={banner.id} className="overflow-hidden">
                <div className="relative h-40 bg-gray-100">
                  <Image
                    src={`/placeholder.svg?height=160&width=400&query=${banner.image}`}
                    alt={banner.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 bg-white/80 hover:bg-white"
                      onClick={() => openPreviewDialog(banner)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 bg-white/80 hover:bg-white"
                      onClick={() => openEditDialog(banner)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 bg-white/80 hover:bg-white text-red-500"
                      onClick={() => handleDeleteBanner(banner)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  <div
                    className={`absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded ${
                      banner.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {banner.active ? "Active" : "Inactive"}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{banner.title}</h3>
                      <p className="text-sm text-gray-500">{banner.position}</p>
                    </div>
                    <Switch
                      checked={banner.active}
                      onCheckedChange={(checked) => handleToggleActive(banner.id, checked)}
                      size="sm"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{banner.description}</p>
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <LinkIcon className="h-3 w-3 mr-1" />
                    <span className="truncate">{banner.url}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(banner.startDate).toLocaleDateString()} to {new Date(banner.endDate).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
            <Card className="border-dashed">
              <CardContent className="p-0">
                <Button
                  variant="ghost"
                  className="h-full w-full flex flex-col items-center justify-center py-12"
                  onClick={() => setIsAddBannerOpen(true)}
                >
                  <Plus className="h-8 w-8 mb-2 text-gray-400" />
                  <span className="text-gray-600 font-medium">Add New Banner</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Banner Dialog */}
      <Dialog open={isEditBannerOpen} onOpenChange={setIsEditBannerOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
            <DialogDescription>Update the details of your promotional banner.</DialogDescription>
          </DialogHeader>
          {bannerToEdit && (
            <form onSubmit={handleEditBanner}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="edit-title"
                    value={bannerToEdit.title}
                    onChange={(e) => setBannerToEdit({ ...bannerToEdit, title: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="edit-description"
                    value={bannerToEdit.description}
                    onChange={(e) => setBannerToEdit({ ...bannerToEdit, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-position" className="text-right">
                    Position
                  </Label>
                  <Select
                    value={bannerToEdit.position}
                    onValueChange={(value) => setBannerToEdit({ ...bannerToEdit, position: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hero">Hero</SelectItem>
                      <SelectItem value="Home Page">Home Page</SelectItem>
                      <SelectItem value="Sidebar">Sidebar</SelectItem>
                      <SelectItem value="Category Pages">Category Pages</SelectItem>
                      <SelectItem value="Product Pages">Product Pages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-url" className="text-right">
                    URL
                  </Label>
                  <Input
                    id="edit-url"
                    value={bannerToEdit.url}
                    onChange={(e) => setBannerToEdit({ ...bannerToEdit, url: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-startDate" className="text-right">
                    Start Date
                  </Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={bannerToEdit.startDate}
                    onChange={(e) => setBannerToEdit({ ...bannerToEdit, startDate: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-endDate" className="text-right">
                    End Date
                  </Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    value={bannerToEdit.endDate}
                    onChange={(e) => setBannerToEdit({ ...bannerToEdit, endDate: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-active" className="text-right">
                    Active
                  </Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Switch
                      id="edit-active"
                      checked={bannerToEdit.active}
                      onCheckedChange={(checked) => setBannerToEdit({ ...bannerToEdit, active: checked })}
                    />
                    <Label htmlFor="edit-active">
                      {bannerToEdit.active ? "Banner is active" : "Banner is inactive"}
                    </Label>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Current Image</Label>
                  <div className="col-span-3">
                    <div className="h-20 w-40 bg-gray-100 rounded overflow-hidden relative">
                      <Image
                        src={`/placeholder.svg?height=80&width=160&query=${bannerToEdit.image}`}
                        alt={bannerToEdit.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-image" className="text-right">
                    Change Image
                  </Label>
                  <div className="col-span-3">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="edit-dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-3 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 2MB)</p>
                        </div>
                        <input
                          id="edit-dropzone-file"
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            // In a real app, you would upload the file to a server
                            // For this demo, we'll just set a placeholder
                            if (e.target.files && e.target.files[0]) {
                              setBannerToEdit({
                                ...bannerToEdit,
                                image: e.target.files[0].name,
                              })
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditBannerOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Banner</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Banner</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this banner? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {bannerToDelete && (
              <div className="flex items-center space-x-4">
                <div className="h-16 w-24 bg-gray-100 rounded overflow-hidden relative">
                  <Image
                    src={`/placeholder.svg?height=64&width=96&query=${bannerToDelete.image}`}
                    alt={bannerToDelete.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">{bannerToDelete.title}</h4>
                  <p className="text-sm text-gray-500">
                    {bannerToDelete.position} • {bannerToDelete.active ? "Active" : "Inactive"}
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

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Banner Preview</DialogTitle>
            <DialogDescription>Preview how your banner will appear on your store.</DialogDescription>
          </DialogHeader>
          {bannerToPreview && (
            <div className="py-4">
              <div className="space-y-4">
                <div className="relative h-48 w-full bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={`/placeholder.svg?height=192&width=640&query=${bannerToPreview.image}`}
                    alt={bannerToPreview.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="text-center text-white p-6 max-w-md">
                      <h2 className="text-2xl font-bold mb-2">{bannerToPreview.title}</h2>
                      <p className="mb-4">{bannerToPreview.description}</p>
                      <Button variant="secondary">Shop Now</Button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-500">Position</p>
                    <p>{bannerToPreview.position}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Status</p>
                    <p>{bannerToPreview.active ? "Active" : "Inactive"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">URL</p>
                    <p className="truncate">{bannerToPreview.url}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Duration</p>
                    <p>
                      {new Date(bannerToPreview.startDate).toLocaleDateString()} to{" "}
                      {new Date(bannerToPreview.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>
              Close
            </Button>
            {bannerToPreview && (
              <Button
                onClick={() => {
                  setIsPreviewDialogOpen(false)
                  openEditDialog(bannerToPreview)
                }}
              >
                Edit Banner
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
