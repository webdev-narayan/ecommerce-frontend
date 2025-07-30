
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
import { mediaUrlGenerator, offPercentCalculator } from "@/lib/utils"
import VariantSelector from "../variant-selector"
import type { Media } from "@/lib/types/type"
import moment from "moment"
import MarkdownIt from "markdown-it";
import NotFound from "./not-found"
import { Badge } from "@/components/ui/badge"
import { productStore } from "@/lib/store"
import React from "react"
import ProductGallery from "./product-gallery"

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

  const getPrice = product && (product.price || product.product_variants[0].price) || 0;
  const getMrp = product && (product.mrp || product.product_variants[0].mrp) || getPrice;

  const [liked, setLiked] = useState<number[]>(productStore.getLikedProducts() || [])

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
      const gallery: Media[] = []
      response.data.gallery?.forEach((item) => {
        gallery.push(item)
      })
      response.data.product_variants.forEach((variant) => {
        variant.gallery?.forEach((item) => {
          gallery.push(item)
        })
      })
      if (response.data.reel) {
        gallery.unshift(response.data.reel.video)
      }

      if (gallery.length === 0 && response.data.thumbnail) {
        gallery.push(response.data.thumbnail)
      }

      setGallery(gallery)
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


  const handleLike = (productId: number) => {
    if (!liked.includes(productId)) {
      setLiked([...liked, productId])
      productStore.addToLikes(productId)
    } else {
      setLiked(liked.filter((id) => id !== productId))
      productStore.removeFromLikes(productId)
    }
  }


  return (
    <div className="min-h-screen bg-white">
      {!isLoading && !product ? <NotFound /> : product && (
        <div className="container mx-auto py-4 md:py-8 px-2 md:px-4">
          <div className="flex flex-col lg:flex-row gap-4 md:gap-8 lg:gap-12 lg:h-[750px]">

            {<ProductGallery productTitle={product.title} gallery={gallery} />}


            {/* Product Details - Scrollable */}
            <div className="w-full lg:w-1/2">
              <div className="h-full lg:overflow-y-auto lg:pr-4 space-y-6 hide-scrollbar">
                {/* Product Info */}
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 text-sm md:text-base">{product?.brand?.name}</p>
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                      {product.title}
                    </h1>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-600 leading-relaxed">{product.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">4.5</span>
                    </div>
                    <span className="text-gray-600 text-sm">({14} reviews)</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-gray-900">₹ {getPrice.toLocaleString("en-IN")}</span>
                      {
                        getPrice < getMrp &&
                        <>
                          <span className="text-lg text-gray-500 line-through">₹ {getMrp.toLocaleString("en-IN")}</span>
                          <Badge variant="destructive" className="text-sm text-white font-light">
                            {offPercentCalculator(getPrice, getMrp).toFixed()} % OFF
                          </Badge>
                        </>
                      }
                    </div>
                    {getPrice < getMrp
                      &&
                      <p className="text-sm text-green-600 font-medium">You save ₹ {getMrp - getPrice}</p>
                    }
                    <p className="text-xs text-gray-500">Inclusive of all taxes</p>
                  </div>

                </div>

                {/* Variant Selector */}
                <div>
                  {
                    product.product_variants.length > 1 &&
                    <VariantSelector
                      product_variants={product.product_variants}
                      onSelect={handleVariantSelect}
                      onNoCombination={() => console.log("No combination found")}
                    />
                  }
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
                      <span className="sm:block hidden">
                        Add to Cart
                      </span>
                    </Button>
                    <Button onClick={() => handleLike(product.id)} variant="outline" size="lg" className="shrink-0 bg-transparent">
                      <Heart className={`h-5 w-5 ${productStore.isProductAddedToLikes(product.id) && "fill-red-500 text-red-500"}`} />
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
                                <div key={review.documentId} className="flex items-start space-x-4">
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


