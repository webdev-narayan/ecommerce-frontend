/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  Star,
  Heart,
  ShoppingCart,
  User,
  Menu,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MapPin,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { CartSheet } from "@/components/cart-sheet"
import { toast } from "sonner"
import { getApi } from '@/lib/api';
import { Product } from "../dashboard/products/product.type"
import { Brand } from "../dashboard/brands/brand.type"
import { Category } from "../dashboard/categories/categories.type"
import { mediaUrlGenerator } from "@/lib/utils"
import { VariantAttribute } from "../dashboard/products/attributes/attribute.type"
import { DualSlider } from "@/components/ui/dua-range-slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import FilterSection from "./components/FilterSection"

export default function ShopPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [selectedBrands, setSelectedBrands] = useState<number[]>([])
  const [selectedVariantOptions, setSelectedVariantOptions] = useState<number[]>([])
  // const [selectedColors, setSelectedColors] = useState<number[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [categories, SetCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [attributes, setAttributes] = useState<VariantAttribute[]>([])
  // const [filters, setFilters] = useState<string | null>(null);

  const [sizes, setSizes] = useState<Brand[]>([])
  const [colors, setColors] = useState<Brand[]>([])

  const { addItem, getTotalItems } = useCart()
  const [debouncedSearchedQuery, setDebouncedSearchedQuery] = useState<string>("")


  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])


  const getProducts = async () => {

    const query = new URLSearchParams();
    query.append("populate[0]", "brand");
    query.append("populate[1]", "category");
    query.append("populate[2]", "thumbnail");
    query.append("populate[3]", "gallery");
    query.append("populate[4]", "product_variants");

    if (selectedCategories.length > 0) {
      selectedCategories.map((category: number, index) => {
        query.append(`filters[$and][0][category][id][$in][${index}]`, category.toString())
      })
    }

    if (selectedBrands.length > 0) {
      selectedBrands.map((brand: number, index) => {
        query.append(`filters[$and][1][brand][id][$in][${index}]`, brand.toString())
      })
    }

    if (selectedVariantOptions.length > 0) {
      selectedVariantOptions.map((variantOption: number, index) => {
        query.append(`filters[$and][2][product_variants][variant_options][id][$in][${index}]`, variantOption.toString())
      })
    }

    if (debouncedSearchedQuery.trim()) {
      query.append("filters[title][$containsi]", debouncedSearchedQuery);
    }


    const res = await getApi<{ data: Product[] }>(`/products?${query.toString()}`, false)
    if (res.success && res.data) {
      setProducts(res.data?.data)
    }
  }

  const getCategories = async () => {
    const res = await getApi<{ data: Category[] }>("/categories", false)
    if (res.success && res.data) {
      SetCategories(res.data?.data)
    }
  }

  const getBrands = async () => {
    const res = await getApi<{ data: Brand[] }>("/brands", false)
    if (res.success && res.data) {
      setBrands(res.data?.data)
    }
  }

  const getAttributes = async () => {
    const query = new URLSearchParams();
    query.append("populate", "variant_options");
    const res = await getApi<{ data: VariantAttribute[] }>(`/variant-attributes?${query.toString()}`, false)
    if (res.success && res.data) {
      setAttributes(res.data?.data)
    }
  }

  useEffect(() => {
    getCategories()
    getBrands()
    getAttributes()
  }, [])

  useEffect(() => {
    getProducts()
  }, [selectedCategories, selectedBrands, selectedVariantOptions])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchedQuery(searchQuery);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    getProducts()
  }, [debouncedSearchedQuery])


  const handleCategoryChange = (category: number, checked: boolean | string) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    }
  }

  const handleBrandChange = (brand: number, checked: boolean | string) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand])
    } else {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand))
    }
  }

  const handleSizeChange = (size: number, checked: boolean | string) => {
    if (checked) {
      setSelectedVariantOptions([...selectedVariantOptions, size])
    } else {
      setSelectedVariantOptions(selectedVariantOptions.filter((s) => s !== size))
    }
  }


  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setSelectedVariantOptions([])
    // setSelectedColors([])
    setPriceRange([0, 500])
    setSearchQuery("")
  }

  // const FilterSection = () => (
  //   <div className="space-y-6 md:block grid grid-cols-2 gap-4">
  //     {/* Search */}
  //     <div className="col-span-2">
  //       <Label className="text-sm font-medium mb-2 block">Search</Label>
  //       <div className="relative">
  //         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
  //         <Input
  //           placeholder="Search products..."
  //           value={searchQuery}
  //           onChange={(e) => setSearchQuery(e.target.value)}
  //           className="pl-10"
  //         // autoFocus
  //         />
  //       </div>
  //     </div>

  //     {/* Price Range */}
  //     <div className="col-span-2">
  //       <Label className="text-sm font-medium mb-2 block">
  //         Price Range: ₹ {priceRange[0]} - ₹ {priceRange[1]}
  //       </Label>
  //       <DualSlider
  //         value={priceRange}
  //         onValueChange={setPriceRange}
  //         max={10000}
  //         min={0}
  //         step={1}
  //         className="w-full"
  //       />
  //     </div>

  //     {/* Categories */}
  //     <div>
  //       <Label className="text-sm font-medium mb-2 block">Categories</Label>
  //       <div className="space-y-2">
  //         <ScrollArea className="h-36">
  //           {categories.map((category) => (
  //             <div key={category.documentId} className="flex items-center space-x-2">
  //               <Checkbox
  //                 id={category.documentId}
  //                 checked={selectedCategories.includes(category.id)}
  //                 onCheckedChange={(checked) => handleCategoryChange(category.id, checked)}
  //               />
  //               <Label htmlFor={category.documentId} className="text-sm">
  //                 {category.name}
  //               </Label>
  //             </div>
  //           ))}
  //         </ScrollArea>
  //       </div>
  //     </div>

  //     {/* Brands */}
  //     <div>
  //       <Label className="text-sm font-medium mb-2 block">Brands</Label>
  //       <div className="space-y-2">
  //         {brands.map((brand) => (
  //           <div key={brand.documentId} className="flex items-center space-x-2">
  //             <Checkbox
  //               id={brand.documentId}
  //               checked={selectedBrands.includes(brand.id)}
  //               onCheckedChange={(checked) => handleBrandChange(brand.id, checked)}
  //             />
  //             <Label htmlFor={brand.documentId} className="text-sm">
  //               {brand.name}
  //             </Label>
  //           </div>
  //         ))}
  //       </div>
  //     </div>

  //     {attributes.length > 0 && attributes.filter(atr => atr.variant_options.length > 0).map(item => {
  //       return <div key={item.documentId}>
  //         <Label className="text-sm font-medium mb-2 block">{item.name}</Label>
  //         <div className="grid grid-cols-3 gap-2">
  //           {item.variant_options.map((vop) => (
  //             <div key={vop.documentId} className="flex items-center space-x-2">
  //               <Checkbox
  //                 id={vop.documentId}
  //                 checked={selectedVariantOptions.includes(vop.id)}
  //                 onCheckedChange={(checked) => handleSizeChange(vop.id, checked)}
  //               />
  //               <Label htmlFor={vop.documentId} className="text-xs">
  //                 {vop.name}
  //               </Label>
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //     })}


  //     <div className="flex gap-2">
  //       {/* Clear Filters */}
  //       {/* <Button size={"sm"} variant="outline" onClick={clearAllFilters} className="w-full">
  //         <Filter /> Apply
  //       </Button> */}

  //       {/* Clear Filters */}
  //       <Button size={"sm"} variant="outline" onClick={clearAllFilters} className="w-full">
  //         <Filter /> Clear
  //       </Button>
  //     </div>
  //   </div>
  // )

  const handleAddToCart = (product: Product) => {
    addItem(product, 1)
    toast.success(`${product.title} added to cart!`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex md:gap-8 gap-4">
          {/* Desktop Filters Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <Filter className="h-4 w-4 text-gray-500" />
              </div>
              <Separator className="mb-6" />
              <FilterSection
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                categories={categories}
                selectedCategories={selectedCategories}
                handleCategoryChange={handleCategoryChange}
                brands={brands}
                selectedBrands={selectedBrands}
                handleBrandChange={handleBrandChange}
                attributes={attributes}
                selectedVariantOptions={selectedVariantOptions}
                handleSizeChange={handleSizeChange}
                clearAllFilters={clearAllFilters}

              />
            </div>
          </div>

          {/* Products */}
          <div className="flex-1">
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {products.length} of {products.length} products
              </p>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 gap-3">
                {products.map((product) => (
                  <Card key={product.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <Link href={`/product/${product.slug}`}>
                        <div className="relative overflow-hidden rounded-t-lg aspect-[3/4] border-2">
                          <img
                            src={mediaUrlGenerator(product?.thumbnail?.url)}
                            alt={product.title}
                            width={300}
                            height={250}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.stock && <Badge className="absolute top-2 left-2 bg-red-500">Sale</Badge>}
                        </div>
                      </Link>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <Link href={`/product/${product.slug}`}>
                            <h3 className="font-semibold text-gray-900 hover:text-gray-700 md:line-clamp-2 line-clamp-1 md:text-base text-xs">{product.title}</h3>
                          </Link>
                          <Button size="icon" variant="ghost" className="hidden md:block">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{product.brand?.name}</p>
                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(4) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500 ml-2">({20})</span>
                        </div>
                        <div className="flex md:flex-row flex-col md:items-center gap-y-2 justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-gray-900">₹{product.price ?? product.product_variants[0].price}</span>
                            {product.mrp && (
                              <span className="text-sm text-gray-500 line-through">${product.mrp}</span>
                            )}
                          </div>
                          <Button size="sm" onClick={() => handleAddToCart(product)}>
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <Link href={`/product/${product.slug}`}>
                          <div className="relative w-32 h-32 flex-shrink-0">
                            <Image
                              src={mediaUrlGenerator(product.thumbnail?.url)}
                              alt={product.title}
                              width={128}
                              height={128}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            {product.stock && (
                              <Badge className="absolute top-1 left-1 bg-red-500 text-xs">Sale</Badge>
                            )}
                          </div>
                        </Link>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <Link href={`/product/${product.slug}`}>
                                <h3 className="text-lg font-semibold text-gray-900 hover:text-gray-700 mb-1">
                                  {product.title}
                                </h3>
                              </Link>
                              <p className="text-gray-500 mb-2">{product?.brand?.name}</p>
                              <div className="flex items-center mb-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${i < Math.floor(5)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                        }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500 ml-2">({100} reviews)</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xl font-bold text-gray-900">${product.price ?? product.product_variants[0]?.price}</span>
                                {product.mrp && (
                                  <span className="text-gray-500 line-through">${product.mrp}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button size="icon" variant="ghost">
                                <Heart className="h-4 w-4" />
                              </Button>
                              <Button onClick={() => handleAddToCart(product)}>
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                <Button variant="outline" onClick={clearAllFilters} className="mt-4">
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Button onClick={() => setShowMobileFilter(true)} variant={"outline"} className="fixed md:hidden bottom-4 text-2xl right-4 rounded-full w-12 h-12 shadow-lg border-2 border-white bg-gray-200">
        <Filter className="block w-10 h-10" />
      </Button>
      <Sheet open={showMobileFilter} onOpenChange={setShowMobileFilter} >
        <SheetContent side={"bottom"}>
          <SheetHeader>
            <SheetTitle>Filter</SheetTitle>
            <SheetDescription>Filter products by category and price range.</SheetDescription>
          </SheetHeader>

          <FilterSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            categories={categories}
            selectedCategories={selectedCategories}
            handleCategoryChange={handleCategoryChange}
            brands={brands}
            selectedBrands={selectedBrands}
            handleBrandChange={handleBrandChange}
            attributes={attributes}
            selectedVariantOptions={selectedVariantOptions}
            handleSizeChange={handleSizeChange}
            clearAllFilters={clearAllFilters}
            isMobile={true}
          />
        </SheetContent>
      </Sheet>
    </div>

  )
}
