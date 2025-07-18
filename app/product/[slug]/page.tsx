"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Star, Heart, ShoppingCart, Minus, Plus, Truck, RotateCcw, Shield, Share2, ChevronLeft, ChevronRight, } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"
import { Product, ProductVariant } from '../../dashboard/products/product.type';
import { getApi } from "@/lib/api"
import { mediaUrlGenerator } from "@/lib/utils"
import VariantSelector from "../variant-selector"
import { Media } from "@/lib/types/type"

export default function ProductPage() {
  const params = useParams()
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const { addItem, getTotalItems } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedProductVariant, setSelectedProductVariant] = useState<ProductVariant | null>(null)
  const [gallery, setGallery] = useState<Media[]>([])
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Sample product data based on ID - in real app, this would be fetched from API
  const getProductBySlug = async () => {
    const slug = params.slug;
    const response = await getApi<Product>(`/products/slug/${slug}`, false)
    if (response.data) {
      setProduct(response.data)
      setSelectedProductVariant(response.data.product_variants[0])
    }
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
    addItem(product, quantity)
    toast.success(`${quantity} ${product?.title}${quantity > 1 ? "s" : ""} added to cart!`)
  }

  const handleVariantSelect = (id: number) => {
    if (selectedProductVariant?.id === id) return; // Avoid unnecessary reset
    const variant = product?.product_variants.find(variant => variant.id === id)
    if (variant) {
      setSelectedProductVariant(variant)
      setSelectedImageIndex(0)
      setGallery(variant?.gallery || [])
    }
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumb */}
      {/* <div className="bg-gray-50 py-4 ">
        <div className="container mx-auto px-4 ">
          <nav className="text-sm text-gray-600 overflow-x-scroll">
            <Link href="/shop" className="hover:text-gray-900">
              Shop
            </Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-gray-900">
              {product?.category?.name}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{params.slug}</span>
          </nav>
        </div>
      </div> */}
      {
        product &&
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 md:gap-12 gap-4">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={mediaUrlGenerator(gallery?.[selectedImageIndex]?.url)}
                  alt={product.title}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
                {product.mrp && <Badge className="absolute top-4 left-4 bg-red-500">Sale</Badge>}

                {/* Image Navigation */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                {gallery?.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${selectedImageIndex === index ? "border-gray-900" : "border-transparent"
                      }`}
                  >
                    <Image
                      src={mediaUrlGenerator(image.url)}
                      alt={`${product.title} view ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <p className="text-gray-600">{product?.brand?.name}</p>
                <h1 className="md:text-3xl text-xl font-bold text-gray-900">{product.title}</h1>
                {/* Description */}
                <div className="">
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(5) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 ml-2">({14} reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-3 mb-6">
                  <span className="md:text-3xl text-lg font-bold text-gray-900">₹ {product.price || product.product_variants[0].price}</span>
                  {product.product_variants[0] && (
                    <span className="md:text-3xl text-sm text-gray-500 line-through">₹{product.product_variants[0].mrp}</span>
                  )}
                  {product.product_variants[0]?.mrp && (
                    <Badge variant="destructive" className="text-white">Save ₹{(product.product_variants[0].mrp - product.product_variants[0].price).toFixed(2)}</Badge>
                  )}
                </div>
              </div>

              <VariantSelector
                product_variants={product.product_variants}
                onSelect={handleVariantSelect}
                onNoCombination={() => console.log("No combination found")}
              />

              {/* Quantity */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Quantity</h3>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange(1)}
                      disabled={selectedProductVariant?.quantity ? quantity >= selectedProductVariant?.quantity : true}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {/* <span className="text-sm text-gray-600">{product.price} items available</span> */}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="lg">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="lg">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
                <Button variant="outline" size="lg" className="w-full">
                  Buy Now
                </Button>
              </div>

              {/* Features */}
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div>
                      <Truck className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                      <p className="text-sm font-medium">Free Shipping</p>
                      <p className="text-xs text-gray-500">On orders over $50</p>
                    </div>
                    <div>
                      <RotateCcw className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                      <p className="text-sm font-medium">Easy Returns</p>
                      <p className="text-xs text-gray-500">30-day policy</p>
                    </div>
                    <div>
                      <Shield className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                      <p className="text-sm font-medium">Secure Payment</p>
                      <p className="text-xs text-gray-500">100% protected</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({product.mrp})</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Product Features</h3>
                    <ul className="space-y-2">
                      {["Feature 1", "Feature 2", "Feature 3"]?.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center py-8">
                      <p className="text-gray-500">Reviews coming soon...</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="shipping" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900">Free Standard Shipping</h4>
                        <p className="text-gray-600">5-7 business days • Free on orders over $50</p>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="font-medium text-gray-900">Express Shipping</h4>
                        <p className="text-gray-600">2-3 business days • $9.99</p>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="font-medium text-gray-900">Next Day Delivery</h4>
                        <p className="text-gray-600">1 business day • $19.99</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      }
    </div>
  )
}
