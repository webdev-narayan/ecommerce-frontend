/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import {
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"
import { getApi } from '@/lib/api';
import { Product } from "../dashboard/products/product.type"
import { Brand } from "../dashboard/brands/brand.type"
import { Category } from "../dashboard/categories/categories.type"
import { VariantAttribute } from "../dashboard/products/attributes/attribute.type"
import FilterSection from "./components/FilterSection"
import { LoadingShoppingCart } from "@/components/loaders"
import ProductCard from "@/components/product-card"
import { useSearchParams, useRouter } from "next/navigation"
import { ImageCarousel } from "@/components/image-carousel"
import React from "react"
import { Banner } from "../dashboard/banners/banner.type"
import { BannerPlacement } from "@/lib/types/type"

export default function ShopPage() {
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
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
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { addItem, getTotalItems } = useCart()
  const [debouncedSearchedQuery, setDebouncedSearchedQuery] = useState<string>("")
  const [hasClearedFilters, setIsClearedFilters] = useState(false)
  const [banners, setBanners] = useState<Banner[]>([])

  const searchParam = useSearchParams()

  const getProducts = async () => {
    setIsLoading(true)
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

    if (selectedCategories.length === 0 && searchParam.get('category') && !hasClearedFilters) {
      query.append(`filters[category][id][$eq]`, searchParam.get('category') || "")
    }

    if (selectedBrands.length === 0 && searchParam.get('brand') && hasClearedFilters) {
      query.append(`filters[brand][id][$eq]`, searchParam.get('brand') || "")
    }


    const res = await getApi<{ data: Product[] }>(`/products?${query.toString()}`, false)
    if (res.success && res.data) {
      setProducts(res.data?.data)
      setIsLoading(false)
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

  const getBanners = async () => {
    const query = new URLSearchParams();
    query.append("filters[placement][$eq]", BannerPlacement.PRODUCT)
    query.append("populate", "*")
    const res = await getApi<{ data: Banner[] }>(`/banners?${query.toString()}`, false)
    if (res.success && res.data) {
      setBanners(res.data?.data)
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
    Promise.allSettled([
      getCategories(),
      getBrands(),
      getAttributes(),
      getBanners()
    ])
  }, [])

  useEffect(() => {
    getProducts()
  }, [selectedCategories, selectedBrands, selectedVariantOptions, debouncedSearchedQuery])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchedQuery(searchQuery);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);


  useEffect(() => {
    if (searchParam.get('category')) {
      setSelectedCategories([Number(searchParam.get('category'))])
    }

    if (searchParam.get('brand')) {
      setSelectedBrands([Number(searchParam.get('brand'))])
    }
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])


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
    setIsClearedFilters(true)
  }

  const handleAddToCart = (product: Product) => {
    addItem(product, 1)
    toast.success(`${product.title} added to cart!`)
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="mt-10 container mx-auto py-6">
        <ImageCarousel
          images={banners.map(item => item.image.url)}
          width={1000}
          height={1000}
          className="md:aspect-[4/1] aspect-[3/1] rounded-xl overflow-hidden"
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-0 py-8">
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
            {
              !isLoading && products.length === 0 ?
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                  <Button variant="outline" onClick={clearAllFilters} className="mt-4">
                    Clear All Filters
                  </Button>
                </div> : isLoading ?
                  <div className="w-full h-[500px] flex flex-col justify-center items-center">
                    <LoadingShoppingCart />
                    <h5>Loading</h5>
                  </div>
                  :
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 gap-3">
                    {products.map((product) => (
                      // <Card key={product.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                      //   <CardContent className="p-0">
                      //     <Link href={`/product/${product.slug}`}>
                      //       <div className="relative overflow-hidden rounded-t-lg aspect-square border-2">
                      //         <Image
                      //           src={mediaUrlGenerator(product?.thumbnail?.url)}
                      //           alt={product.title}
                      //           width={300}
                      //           height={250}
                      //           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      //         />
                      //         {product.stock && <Badge className="absolute top-2 left-2 bg-red-500">Sale</Badge>}

                      //         <Button size="icon" variant="ghost" className="hidden md:grid absolute top-2 right-2 bg-white rounded-full place-items-center">
                      //           <Heart className="h-4 w-4" />
                      //         </Button>
                      //       </div>
                      //     </Link>
                      //     <div className="p-4 flex flex-col gap-1">
                      //       <div className="">
                      //         <Link href={`/product/${product.slug}`}>
                      //           <h3 className="font-semibold text-gray-900 hover:text-gray-700 md:line-clamp-2 line-clamp-1 md:text-base text-xs">{product.title}</h3>
                      //         </Link>
                      //       </div>

                      //       <div className="flex justify-between">
                      //         <p className="text-sm text-gray-500">{product.brand?.name}</p>
                      //         <div className="flex items-center">
                      //           <Star className={`w-4 h-4 fill-yellow-400 text-yellow-400`}
                      //           />
                      //           <span className="text-sm text-gray-500 ml-2">{4.5}</span>
                      //         </div>
                      //       </div>

                      //       <div className="flex md:flex-row flex-col md:items-center gap-y-2 justify-between">
                      //         <div className="flex items-center space-x-2">
                      //           <span className="font-bold text-gray-900">₹{product.price ?? product.product_variants[0].price}</span>
                      //           {product.mrp && (
                      //             <span className="text-sm text-gray-500 line-through">${product.mrp}</span>
                      //           )}
                      //         </div>
                      //         <Button size="sm" onClick={() => handleAddToCart(product)}>
                      //           <ShoppingCart className="h-4 w-4 mr-1" />
                      //           Add
                      //         </Button>
                      //       </div>

                      //     </div>
                      //   </CardContent>
                      // </Card>
                      <ProductCard
                        key={product.documentId}
                        showAddToWishlist={true}
                        product={product} />
                    ))}
                  </div>
            }
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
