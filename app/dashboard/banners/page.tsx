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
import { deleteApi, getApi, postApi, putApi, uploadToStrapi } from "@/lib/api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { mediaUrlGenerator } from "@/lib/utils";
import CustomPagination from "@/components/ui/custom-pagination";
import { MetaResponse } from "@/lib/types/type";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, } from "@/components/ui/sheet"

import { Banner } from './banner.type';
import { Switch } from "@/components/ui/switch"
import FileUpload from "@/components/ui/file-upload"

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [selectedBanners, setSelectedBanners] = useState<number[]>([])
  const [isBannerFormOpen, setIsBannerFormOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [bannerToAction, setBannerToAction] = useState<Banner | null>(null)

  const [searchTerm, setSearchTerm] = useState<string>("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState("list")
  const [debouncedSearchedQuery, setDebouncedSearchedQuery] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [meta, setMeta] = useState<MetaResponse>()
  const [isMobile, setIsMobile] = useState(false)


  async function getBanners() {
    const query = new URLSearchParams();

    query.append("pagination[page]", page.toString());
    query.append("pagination[pageSize]", pageSize.toString());
    query.append("populate", "image")
    if (debouncedSearchedQuery.trim()) {
      query.append("filters[title][$containsi]", debouncedSearchedQuery);
    }

    const res = await getApi<{ data: Banner[], meta: MetaResponse }>(`/banners?${query}`, true)
    if (res.success && res.data) {
      setBanners(res.data?.data)
      setMeta(res.data?.meta)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBanners(banners.map((banner) => banner.id))
    } else {
      setSelectedBanners([])
    }
  }

  const handleSelectBanner = (bannerId: number, checked: string | boolean) => {
    if (checked) {
      setSelectedBanners([...selectedBanners, bannerId])
    } else {
      setSelectedBanners(selectedBanners.filter((id) => id !== bannerId))
    }
  }

  const handleDeleteBanner = (banner: Banner) => {
    setBannerToAction(banner)
    setIsDeleteDialogOpen(true)
  }
  const handleEditBanner = (banner: Banner) => {
    setIsEditing(true)
    setBannerToAction(banner)
    setIsBannerFormOpen(true)

  }

  const confirmDelete = async () => {

    const res = await deleteApi(`/banners/${bannerToAction?.documentId}`)
    if (res.success) {

      toast.success(`Banner "${bannerToAction?.title}" deleted successfully`)
      setBanners(banners.filter((banner) => banner.id !== bannerToAction?.id))
      setIsDeleteDialogOpen(false)
      setBannerToAction(null)
    }
  }

  // const handleBulkDelete = () => {
  //     // In a real app, you would call an API to delete the selected banners
  //     toast.success(`${selectedBanners.length} banners deleted successfully`)
  //     setSelectedBanners([])
  // }

  const handleSaveBanner = async (formData: FormData) => {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const link_url = formData.get("link_url") as string;
    const is_active = formData.get("is_active") as string;

    const files = formData.getAll("desktop_image") as File[]
    let thumbnail: number | null = null;
    if (files.length > 0) {
      const res = await uploadToStrapi(files)
      if (res) {
        thumbnail = res[0].id
      }
    }

    const payload = {
      title: title,
      image: thumbnail,
      description: description,
      link_url: link_url,
      is_active: is_active == "on" ? true : false
    }

    if (isEditing && bannerToAction) {
      const res = await putApi<{ data: Banner }>(`/banners/${bannerToAction.documentId}`, {
        data: payload
      }, true)
      if (res.success && res.data) {
        toast.success("Banner added successfully")
        setBanners(banners.map((banner) => {
          // @ts-ignore
          if (banner.id === res?.data.data.id) {
            return res.data.data
          }
          return banner
        }))
        setIsBannerFormOpen(false)
        setIsEditing(false)
      }

    } else {
      const res = await postApi<{ data: Banner }>("/banners", {
        data: payload
      }, true)
      if (res.success && res.data) {
        toast.success("Banner added successfully")
        setBanners([...banners, res.data.data])
        setIsBannerFormOpen(false)
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
    getBanners()
  }, [debouncedSearchedQuery])

  useEffect(() => {
    if (!isBannerFormOpen) {
      setIsEditing(false)
    }
  }, [isBannerFormOpen])

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  function handleUpdateBannerStatus(documentId: string, checked: boolean): void {
    console.log(documentId, checked)
    throw new Error("Function not implemented.")
  }

  return (
    <>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="md:text-3xl font-bold">Banners</h1>
          <Button
            // onClick={() => redirect("/dashboard/products/create")}
            onClick={() => setIsBannerFormOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className={"hidden md:inline"}>
              Add Banner
            </span>
          </Button>
          <Sheet open={isBannerFormOpen} onOpenChange={setIsBannerFormOpen}>
            <SheetContent side={isMobile ? "bottom" : "right"}
              className={isMobile ? "h-[85vh]" : "w-[400px] sm:w-[540px]"}>
              <SheetHeader>
                <SheetTitle>Create New Banner</SheetTitle>
                <SheetDescription>
                  Add a new banner with a name and logo. Click save when you are done.
                </SheetDescription>
              </SheetHeader>

              <form action={handleSaveBanner} className="space-y-6 py-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    {...(isEditing && bannerToAction && { value: bannerToAction.title })}
                    placeholder="Enter banner title"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    {...(isEditing && bannerToAction && { value: bannerToAction.description })}
                    placeholder="Enter banner description"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="link_url">Link Url</Label>
                  <Input
                    id="link_url"
                    name="link_url"
                    {...(isEditing && bannerToAction && { value: bannerToAction.link_url })}
                    placeholder="Enter banner Link url"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="is_active">Active</Label>
                  <Switch
                    id="is_active"
                    name="is_active"
                    {...(isEditing && bannerToAction && { checked: bannerToAction.is_active })}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <FileUpload
                    title="Desktop Image"
                    isMultiple={false}
                    key={"desk_image"}
                    maxFileSize={3}
                    name={"desktop_image"}
                  // onFilesChange={(file:File[])=>}
                  />
                </div>

                <SheetFooter className="flex flex-col sm:flex-row gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsBannerFormOpen(false)}
                    className="w-full sm:w-auto">
                    Cancel
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto">
                    Create Banner
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
                  placeholder="Search banners..."
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
                          checked={selectedBanners.length === banners.length && banners.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Cover</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {banners.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center">
                            <Upload className="h-12 w-12 text-gray-300 mb-2" />
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
                      banners.map((banner: Banner) => (
                        <TableRow key={banner.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedBanners.includes(banner.id)}
                              onCheckedChange={(checked) => handleSelectBanner(banner.id, checked)}
                            />
                          </TableCell>
                          <TableCell className="whitespace-nowrap md:w-[300px]">
                            <div className="flex gap-2">
                              <div className="aspect-[2/1] max-h-[100px] rounded overflow-hidden">
                                <img
                                  src={mediaUrlGenerator(banner?.image?.url)}
                                  alt={banner.title}
                                  className="w-full h-full object-left object-cover"
                                />
                              </div>
                              <div className="aspect-square max-h-[100px] overflow-hidden rounded">
                                <img
                                  src={mediaUrlGenerator(banner?.image?.url)}
                                  alt={banner.title}
                                  className="w-full h-full object-center object-cover"
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{banner.title}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{banner.description}</div>
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={banner.is_active}
                              onCheckedChange={(checked) => handleUpdateBannerStatus(banner.documentId, checked)}
                            />
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
                                  onClick={() => handleEditBanner(banner)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit banner
                                </DropdownMenuItem>
                                <DropdownMenuItem>View products</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600"
                                  onClick={() => handleDeleteBanner(banner)}>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grid" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {banners.length > 0 ? banners.map((banner: Banner) => (
                <Card
                  key={banner.id}
                  className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white"
                >
                  <CardHeader className="p-0">
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <Image
                        src={mediaUrlGenerator(banner?.image?.url)}
                        alt={banner.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
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
                              onClick={() => handleEditBanner(banner)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit banner
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <LucideEye className="mr-2 h-4 w-4" />
                              View products
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600"
                              onClick={() => handleDeleteBanner(banner)}>
                              <Trash className="mr-2 h-4 w-4" />
                              Delete banner
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{banner.title}</h3>
                      </div>
                      {/*<p className="text-sm text-gray-600 line-clamp-2">{banner.description}</p>*/}
                      <div className="flex items-center justify-between pt-2">
                        <div
                          className="flex justify-between w-full items-center gap-1 text-sm text-gray-500">
                          Status <div
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${banner?.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                              }`}
                          >

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
                      onClick={() => handleDeleteBanner(banner)}
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
                  <h3 className="text-lg font-medium">No banner found</h3>
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
              <DialogTitle>Delete Banner</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this banner? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {bannerToAction && (
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center">
                    <Package className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">{bannerToAction.title}</h4>
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
