/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"

import { useEffect, useState } from "react"
import {
  Edit,
  LucideEye,
  MoreHorizontal, Package,
  Plus,
  Search,
  Trash, X,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { deleteApi, getApi, postApi, putApi, uploadToStrapi } from "@/lib/api"
import { mediaUrlGenerator } from "@/lib/utils";
import CustomPagination from "@/components/ui/custom-pagination";
import { MetaResponse } from "@/lib/types/type";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, } from "@/components/ui/sheet"

import { CreateReel, Reel } from './reel.type';
import { Switch } from "@/components/ui/switch"
import FileUpload from "@/components/ui/file-upload"
import { CustomCombobox } from "@/components/custom-combobox"
import { Product } from "../products/product.type"

export default function ReelsPage() {
  const [reels, setBanners] = useState<Reel[]>([])
  const [isBannerFormOpen, setIsBannerFormOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [reelToAction, setReelToAction] = useState<Reel | null>(null)

  const [searchTerm, setSearchTerm] = useState<string>("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
  const [debouncedSearchedQuery, setDebouncedSearchedQuery] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [meta, setMeta] = useState<MetaResponse>()
  const [isMobile, setIsMobile] = useState(false)
  const [products, setProducts] = useState<Product[]>([])

  async function getReels() {
    const query = new URLSearchParams();

    query.append("pagination[page]", page.toString());
    query.append("pagination[pageSize]", pageSize.toString());
    query.append("populate", "video")
    if (debouncedSearchedQuery.trim()) {
      query.append("search", debouncedSearchedQuery);
    }

    const res = await getApi<{ data: Reel[], meta: MetaResponse }>(`/reels?${query}`, true)
    if (res.success && res.data) {
      setBanners(res.data?.data)
      setMeta(res.data?.meta)
    }
  }

  const getProudcts = async (search: string): Promise<{ label: string, value: string }[]> => {
    const query = new URLSearchParams();
    query.append("pagination[page]", "1")
    query.append("pagination[pageSize]", "50")

    if (search.trim()) {
      query.append("filters[title][$containsi]", search)
    }
    const res = await getApi<{ data: Product[] }>(`/products?${query.toString()}`)
    setProducts(res.data?.data ?? [])
    return res.data?.data?.map((item) => ({ value: item.id.toString(), label: item.title })) ?? []
  }

  //   const getBrands = async (search) => {
  //   const response = await apiRepository.brands.getAll(query)
  // }

  const handleDeleteBanner = (reel: Reel) => {
    setReelToAction(reel)
    setIsDeleteDialogOpen(true)
  }
  const handleEditBanner = (reel: Reel) => {
    setIsEditing(true)
    setReelToAction(reel)
    setIsBannerFormOpen(true)
  }

  const confirmDelete = async () => {
    const res = await deleteApi(`/reels/${reelToAction?.documentId}`)
    if (res.success) {

      toast.success(`Reel "${reelToAction?.title}" deleted successfully`)
      setBanners(reels.filter((reel) => reel.id !== reelToAction?.id))
      setIsDeleteDialogOpen(false)
      setReelToAction(null)
    }
  }


  const handleSaveBanner = async (formData: FormData) => {
    const title = formData.get("title") as string
    const is_active = formData.get("is_active") as string;

    const files = formData.getAll("video") as File[]
    let video: number | null = null;
    if (files.length > 0) {
      const res = await uploadToStrapi(files)
      if (res) {
        video = res[0].id
      }
    }

    const payload: CreateReel = {
      title: title,
      video: video,
      products: [1],
      is_active: is_active == "on" ? true : false
    }

    if (isEditing && reelToAction) {
      const res = await putApi<{ data: Reel }>(`/reels/${reelToAction.documentId}`, {
        data: payload
      }, true)
      if (res.success && res.data) {
        toast.success("Reel added successfully")
        setBanners(reels.map((reel) => {
          // @ts-ignore
          if (reel.id === res?.data.data.id) {
            return res.data.data
          }
          return reel
        }))
        setIsBannerFormOpen(false)
      }

    } else {
      const res = await postApi<{ data: Reel }>("/reels", {
        data: payload
      }, true)
      if (res.success && res.data) {
        toast.success("Reel added successfully")
        setBanners([...reels, res.data.data])
        setIsBannerFormOpen(false)
      }
    }
  }

  useEffect(() => {
    getProudcts("")
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
    getReels()
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

  // const productOptions = products.map(item => item)

  const productOptions = [...products
    .map((pro) => {
      const id = pro.documentId || pro.id
      return {
        value: id ? id.toString() : "",
        label: pro.title || "Unknown Product",
      }
    })
    .filter((option) => option.value),
  ...products
    .map((pro) => {
      const id = pro.documentId || pro.id
      return {
        value: id ? id.toString() : "",
        label: pro.title || "Unknown Product",
      }
    })
    .filter((option) => option.value),
  ...products
    .map((pro) => {
      const id = pro.documentId || pro.id
      return {
        value: id ? id.toString() : "",
        label: pro.title || "Unknown Product",
      }
    })
    .filter((option) => option.value)


  ]
  return (
    <>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="md:text-3xl font-bold">Reels</h1>
          <Button
            // onClick={() => redirect("/dashboard/products/create")}
            onClick={() => setIsBannerFormOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className={"hidden md:inline"}>
              Add Reel
            </span>
          </Button>
          <Sheet open={isBannerFormOpen} onOpenChange={setIsBannerFormOpen}>
            <SheetContent side={isMobile ? "bottom" : "right"}
              className={isMobile ? "h-[85vh]" : "w-[400px] sm:w-[540px]"}>
              <SheetHeader>
                <SheetTitle>Create New Reel</SheetTitle>
                <SheetDescription>
                  Add a new reel with a name and logo. Click save when you are done.
                </SheetDescription>
              </SheetHeader>

              <form action={handleSaveBanner} className="space-y-6 py-6">
                <div className="flex flex-col gap-2">
                  <CustomCombobox
                    onSearch={getProudcts}
                    value={""}
                    onValueChange={() => { }}
                    emptyText="No Products Found"
                    debounceMs={400}
                    enableServerSearch={true}
                    placeholder="Search"
                    options={productOptions}
                    addButtonText={""}
                    searchPlaceholder={"search"}
                    minSearchLength={4}
                  />

                  {/* <CustomCombobox
                    options={brandOptions}
                    value={formData.brand}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, brand: value }))}
                    onAddClick={() => setBrandFormOpen(true)}
                    placeholder="Select brand..."
                    searchPlaceholder="Search brands..."
                    emptyText="No brand found."
                    addButtonText="Add brand"

                    debounceMs={500}
                    minSearchLength={3}
                    enableServerSearch={true}
                    onSearch={getBrands}
                  /> */}


                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    {...(isEditing && reelToAction && { value: reelToAction.title })}
                    placeholder="Enter reel title"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="is_active">Active</Label>
                  <Switch
                    id="is_active"
                    name="is_active"
                    {...(isEditing && reelToAction && { checked: reelToAction.is_active })}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <FileUpload
                    title="Upload Video"
                    isMultiple={false}
                    key={"video"}
                    maxFileSize={3}
                    name={"video"}
                  // onFilesChange={(file:File[])=>}
                  />
                </div>

                <SheetFooter className="flex flex-col sm:flex-row gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsBannerFormOpen(false)}
                    className="w-full sm:w-auto">
                    Cancel
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto">
                    Create Reel
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
                placeholder="Search reels..."
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {reels.length > 0 ? reels.map((reel: Reel) => (
            <Card
              key={reel.id}
              className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white aspect-[9/16]"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100 h-full w-full">
                <video src={mediaUrlGenerator(reel.video.url)}
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="object-contain mx-auto w-full"
                >

                </video>
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
                    <DropdownMenuContent align="end" className="flex flex-col p-3 gap-2">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <Button
                        size={"sm"}
                        variant={"outline"}
                        onClick={() => handleEditBanner(reel)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit reel
                      </Button>
                      <Button size={"sm"} variant={"outline"} className="flex items-center text-sm">
                        <LucideEye className="mr-2 h-4 w-4" />
                        <Dialog>
                          <DialogTrigger className="cursor-pointer">
                            Products
                          </DialogTrigger>
                          <DialogContent className="min-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Products</DialogTitle>
                              <div className="grid grid-cols-2 gap-3">
                                {reel.products?.map(product => (
                                  <Card className="flex items-start gap-4">
                                    <div>
                                      <img
                                        src={mediaUrlGenerator(product.thumbnail?.url)}
                                        className="aspect-square max-w-[100px] object-cover"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <h3>{product.title}</h3>
                                      <h4 className="text-xs line-clamp-2 text-gray-600">{product.description}</h4>
                                      <h5>₹ {product.price}</h5>
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </Button>
                      <Button variant={"outline"} className="text-red-600"
                        onClick={() => handleDeleteBanner(reel)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete reel
                      </Button>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))
            :
            <div
              className="flex flex-col items-center justify-center bg-white shadow-sm rounded-md p-8 col-span-full">
              <Package className="h-12 w-12 text-gray-300 mb-2" />
              <h3 className="text-lg font-medium">No reel found</h3>
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

        <div className="flex bg-white p-2 w-fit ml-auto mt-4 shadow-md rounded-md">
          <CustomPagination
            setPage={setPage}
            meta={meta}
            setPageSize={setPageSize}
          />
        </div>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Reel</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this reel? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {reelToAction && (
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center">
                    <Package className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">{reelToAction.title}</h4>
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
