
"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import {
  Star,
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  RotateCcw,
  Shield,
  Share2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"
import type { Product, ProductVariant } from "../../dashboard/products/product.type"
import { getApi } from "@/lib/api"
import { mediaUrlGenerator } from "@/lib/utils"
import VariantSelector from "../variant-selector"
import type { Media } from "@/lib/types/type"
import moment from "moment"
import MarkdownIt from "markdown-it";
import NotFound from "./not-found"

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

export default function ProductPage() {
  const params = useParams()
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const { addItem, getTotalItems } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedProductVariant, setSelectedProductVariant] = useState<ProductVariant | null>(null)
  const [gallery, setGallery] = useState<Media[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Sample product data based on ID - in real app, this would be fetched from API
  const getProductBySlug = async () => {
    const slug = params.slug
    const response = await getApi<Product>(`/products/slug/${slug}`, false)
    if (response.data) {
      setProduct(response.data)
      setSelectedProductVariant(response.data.product_variants[0])
      const allGallery: Media[] = []
      response.data.gallery?.forEach((item) => {
        allGallery.push(item)
      })
      response.data.product_variants.forEach((variant) => {
        variant.gallery?.forEach((item) => {
          allGallery.push(item)
        })
      })
      setGallery(allGallery)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    getProductBySlug()
  }, [params.slug])

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    setQuantity(newQuantity)
  }

  const nextImage = () => {
    if (gallery?.length) {
      setSelectedImageIndex((prev) => (prev + 1) % gallery.length)
    }
  }

  const prevImage = () => {
    if (gallery) {
      setSelectedImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity, selectedProductVariant!)
    }
    toast.success(`${quantity} ${product?.title}${quantity > 1 ? "s" : ""} added to cart!`)
  }

  const handleVariantSelect = (id: number) => {
    if (selectedProductVariant?.id === id) return // Avoid unnecessary reset
    const variant = product?.product_variants.find((variant) => variant.id === id)
    if (variant) {
      setSelectedProductVariant(variant)
      setSelectedImageIndex(0)
      setGallery(variant?.gallery || [])
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {!isLoading && !product ? <NotFound /> : product && (
        <div className="container mx-auto py-4 md:py-8 px-2 md:px-4">
          <div className="flex flex-col lg:flex-row gap-4 md:gap-8 lg:gap-12">
            {/* Product Images - Sticky on desktop */}
            <div className="w-full lg:w-1/2 lg:sticky lg:top-4 lg:self-start">
              <div className="flex flex-col-reverse md:flex-row gap-2 md:gap-4">
                {/* Thumbnail Images */}
                <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
                  <div className="flex md:flex-col gap-2 md:max-w-[100px] lg:max-w-[120px]">
                    {gallery?.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${selectedImageIndex === index ? "border-gray-900" : "border-transparent hover:border-gray-300"
                          }`}
                      >
                        <Image
                          src={mediaUrlGenerator(image.url) || "/placeholder.svg"}
                          alt={`${product.title} view ${index + 1}`}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Image */}
                <div className="flex-1">
                  <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={mediaUrlGenerator(gallery?.[selectedImageIndex]?.url) || "/placeholder.svg"}
                      alt={product.title}
                      width={600}
                      height={600}
                      className="w-full h-full object-cover"
                      priority
                    />

                    {/* Image Navigation */}
                    {gallery?.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-md"
                          onClick={prevImage}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-md"
                          onClick={nextImage}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </>
                    )}

                    {/* Image indicator dots */}
                    {gallery?.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {gallery.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${selectedImageIndex === index ? "bg-white" : "bg-white/50"
                              }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details - Scrollable */}
            <div className="w-full lg:w-1/2">
              <div className="lg:max-h-screen lg:overflow-y-auto lg:pr-4 space-y-6">
                {/* Product Info */}
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 text-sm md:text-base">{product?.brand?.name}</p>
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                      {product.title}
                    </h1>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">4.5</span>
                    </div>
                    <span className="text-gray-600 text-sm">({14} reviews)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl md:text-3xl font-bold text-gray-900">
                      ₹{product.price || product.product_variants[0].price}
                    </span>
                    {product?.mrp > product.price && (
                      <span className="text-lg md:text-xl text-gray-500 line-through">₹{product.mrp}</span>
                    )}
                  </div>

                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                  </div>
                </div>

                {/* Variant Selector */}
                <div>
                  <VariantSelector
                    product_variants={product.product_variants}
                    onSelect={handleVariantSelect}
                    onNoCombination={() => console.log("No combination found")}
                  />
                </div>

                {/* Quantity */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Quantity</h3>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="h-10 w-10"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQuantityChange(1)}
                        disabled={
                          selectedProductVariant?.quantity ? quantity >= selectedProductVariant?.quantity : true
                        }
                        className="h-10 w-10"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {selectedProductVariant?.quantity && (
                      <span className="text-sm text-gray-600">{selectedProductVariant.quantity} items available</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </Button>
                    <Button variant="outline" size="lg" className="shrink-0 bg-transparent">
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="lg" className="shrink-0 bg-transparent">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                  <Button variant="outline" size="lg" className="w-full bg-transparent">
                    Buy Now
                  </Button>
                </div>

                {/* Features */}
                <Card className="shadow-none">
                  <CardContent className="p-4 md:p-6">
                    <div className="grid grid-cols-3 gap-4 md:gap-6 text-center">
                      <div>
                        <Truck className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-2 text-gray-600" />
                        <p className="text-xs md:text-sm font-medium">Free Shipping</p>
                        <p className="text-xs text-gray-500">On orders over ₹50</p>
                      </div>
                      <div>
                        <RotateCcw className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-2 text-gray-600" />
                        <p className="text-xs md:text-sm font-medium">Easy Returns</p>
                        <p className="text-xs text-gray-500">30-day policy</p>
                      </div>
                      <div>
                        <Shield className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-2 text-gray-600" />
                        <p className="text-xs md:text-sm font-medium">Secure Payment</p>
                        <p className="text-xs text-gray-500">100% protected</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Product Details Tabs */}
                <div className="mt-8">
                  <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="details" className="text-xs md:text-sm">
                        Details
                      </TabsTrigger>
                      <TabsTrigger value="reviews" className="text-xs md:text-sm">
                        Reviews ({product.review_count})
                      </TabsTrigger>
                      <TabsTrigger value="shipping" className="text-xs md:text-sm">
                        Shipping
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="mt-6">
                      <Card className="shadow-none">
                        <CardContent className="p-4 md:p-6">
                          {
                            product.description_rich_text &&
                            (
                              <div className="md-div" dangerouslySetInnerHTML={{ __html: md.render(product.description_rich_text) }} />
                            )
                          }
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="reviews" className="mt-6">
                      <Card className="shadow-none">
                        <CardContent className="p-4 md:p-2 divide-y space-y-2">
                          {product?.reviews ? (
                            product.reviews
                              .map((review, index) => (
                                <>
                                  <div key={index} className="flex items-start space-x-4">
                                    {/* <Avatar size="small" src={mediaUrlGenerator(review.user.avatar)} /> */}
                                    <div className="">
                                      <img
                                        className="aspect-square max-w-12 border rounded-full object-cover object-top"
                                        src={mediaUrlGenerator(review.user?.profile?.url)} alt="" />
                                    </div>
                                    <div>
                                      <p className="text-sm md:text-base font-medium text-gray-900 flex justify-between items-center">
                                        {review?.user?.name}
                                        <span className="text-xs text-gray-400 font-light">
                                          {moment(review.createdAt).fromNow(true)} ago
                                        </span>
                                      </p>
                                      <p className="text-sm md:text-base text-gray-600 flex items-center gap-2"> <Star className="size-4 fill-yellow-400 text-yellow-400" />{review.rating} out of 5</p>
                                      <p className="text-sm md:text-base">{review.comment}</p>
                                    </div>
                                  </div>
                                  {/* <Separator className="my-2" /> */}
                                </>
                              ))
                          )
                            :
                            <div className="text-center py-8">
                              <p className="text-gray-500">No reviews yet...</p>
                            </div>
                          }
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="shipping" className="mt-6">
                      <Card>
                        <CardContent className="p-4 md:p-6">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium text-gray-900">Free Standard Shipping</h4>
                              <p className="text-gray-600 text-sm">5-7 business days • Free on orders over ₹50</p>
                            </div>
                            <Separator />
                            <div>
                              <h4 className="font-medium text-gray-900">Express Shipping</h4>
                              <p className="text-gray-600 text-sm">2-3 business days • ₹99</p>
                            </div>
                            <Separator />
                            <div>
                              <h4 className="font-medium text-gray-900">Next Day Delivery</h4>
                              <p className="text-gray-600 text-sm">1 business day • ₹199</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Bottom padding for scroll */}
                <div className="h-8"></div>
              </div>
            </div>
          </div>
        </div>
      )
      }
    </div >
  )
}
