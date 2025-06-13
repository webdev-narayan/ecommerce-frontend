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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { CartSheet } from "@/components/cart-sheet"
import { toast } from "sonner"

export default function ShopPage() {
  const [viewMode, setViewMode] = useState("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedSizes, setSelectedSizes] = useState([])
  const [selectedColors, setSelectedColors] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])

  const { addItem, getTotalItems } = useCart()

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Sample products data
  const allProducts = [
    {
      id: 1,
      name: "Classic White Sneakers",
      price: 89.99,
      originalPrice: 119.99,
      rating: 4.5,
      reviews: 128,
      image: "white sneakers",
      category: "Shoes",
      brand: "Nike",
      sizes: ["7", "8", "9", "10", "11"],
      colors: ["White", "Black"],
      isOnSale: true,
    },
    {
      id: 2,
      name: "Denim Jacket",
      price: 79.99,
      originalPrice: null,
      rating: 4.8,
      reviews: 89,
      image: "denim jacket",
      category: "Outerwear",
      brand: "Levi's",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Blue", "Black"],
      isOnSale: false,
    },
    {
      id: 3,
      name: "Leather Handbag",
      price: 159.99,
      originalPrice: 199.99,
      rating: 4.6,
      reviews: 67,
      image: "leather handbag",
      category: "Bags",
      brand: "Coach",
      sizes: ["One Size"],
      colors: ["Brown", "Black", "Tan"],
      isOnSale: true,
    },
    {
      id: 4,
      name: "Wool Sweater",
      price: 69.99,
      originalPrice: null,
      rating: 4.7,
      reviews: 156,
      image: "wool sweater",
      category: "Clothing",
      brand: "Uniqlo",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Gray", "Navy", "Beige"],
      isOnSale: false,
    },
    {
      id: 5,
      name: "Running Shoes",
      price: 129.99,
      originalPrice: 149.99,
      rating: 4.9,
      reviews: 234,
      image: "running shoes",
      category: "Shoes",
      brand: "Adidas",
      sizes: ["7", "8", "9", "10", "11", "12"],
      colors: ["Black", "White", "Blue"],
      isOnSale: true,
    },
    {
      id: 6,
      name: "Silk Scarf",
      price: 39.99,
      originalPrice: null,
      rating: 4.4,
      reviews: 45,
      image: "silk scarf",
      category: "Accessories",
      brand: "Hermès",
      sizes: ["One Size"],
      colors: ["Red", "Blue", "Gold"],
      isOnSale: false,
    },
    {
      id: 7,
      name: "Casual T-Shirt",
      price: 24.99,
      originalPrice: 34.99,
      rating: 4.3,
      reviews: 312,
      image: "casual t-shirt",
      category: "Clothing",
      brand: "H&M",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["White", "Black", "Gray", "Navy"],
      isOnSale: true,
    },
    {
      id: 8,
      name: "Winter Coat",
      price: 199.99,
      originalPrice: 249.99,
      rating: 4.8,
      reviews: 78,
      image: "winter coat",
      category: "Outerwear",
      brand: "Zara",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "Navy", "Camel"],
      isOnSale: true,
    },
    {
      id: 9,
      name: "Smart Watch",
      price: 299.99,
      originalPrice: null,
      rating: 4.6,
      reviews: 189,
      image: "smart watch",
      category: "Electronics",
      brand: "Apple",
      sizes: ["38mm", "42mm"],
      colors: ["Silver", "Black", "Gold"],
      isOnSale: false,
    },
    {
      id: 10,
      name: "Sunglasses",
      price: 149.99,
      originalPrice: 179.99,
      rating: 4.5,
      reviews: 92,
      image: "sunglasses",
      category: "Accessories",
      brand: "Ray-Ban",
      sizes: ["One Size"],
      colors: ["Black", "Brown", "Gold"],
      isOnSale: true,
    },
    {
      id: 11,
      name: "Yoga Pants",
      price: 59.99,
      originalPrice: null,
      rating: 4.7,
      reviews: 267,
      image: "yoga pants",
      category: "Activewear",
      brand: "Lululemon",
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Black", "Gray", "Navy"],
      isOnSale: false,
    },
    {
      id: 12,
      name: "Baseball Cap",
      price: 29.99,
      originalPrice: 39.99,
      rating: 4.2,
      reviews: 134,
      image: "baseball cap",
      category: "Accessories",
      brand: "Nike",
      sizes: ["One Size"],
      colors: ["Black", "White", "Red", "Blue"],
      isOnSale: true,
    },
  ]

  const categories = ["Clothing", "Shoes", "Bags", "Accessories", "Outerwear", "Electronics", "Activewear"]
  const brands = [
    "Nike",
    "Adidas",
    "Levi's",
    "Coach",
    "Uniqlo",
    "Hermès",
    "H&M",
    "Zara",
    "Apple",
    "Ray-Ban",
    "Lululemon",
  ]
  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "7", "8", "9", "10", "11", "12", "38mm", "42mm", "One Size"]
  const colors = ["Black", "White", "Gray", "Navy", "Blue", "Brown", "Red", "Gold", "Silver", "Tan", "Beige", "Camel"]

  // Filter products based on selected filters
  useEffect(() => {
    const filtered = allProducts.filter((product) => {
      // Search filter
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false
      }

      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false
      }

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false
      }

      // Size filter
      if (selectedSizes.length > 0 && !product.sizes.some((size) => selectedSizes.includes(size))) {
        return false
      }

      // Color filter
      if (selectedColors.length > 0 && !product.colors.some((color) => selectedColors.includes(color))) {
        return false
      }

      return true
    })

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filtered.sort((a, b) => b.id - a.id)
        break
      default:
        // Keep original order for "featured"
        break
    }

    setFilteredProducts(filtered)
  }, [searchQuery, priceRange, selectedCategories, selectedBrands, selectedSizes, selectedColors, sortBy])

  const handleCategoryChange = (category, checked) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    }
  }

  const handleBrandChange = (brand, checked) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand])
    } else {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand))
    }
  }

  const handleSizeChange = (size, checked) => {
    if (checked) {
      setSelectedSizes([...selectedSizes, size])
    } else {
      setSelectedSizes(selectedSizes.filter((s) => s !== size))
    }
  }

  const handleColorChange = (color, checked) => {
    if (checked) {
      setSelectedColors([...selectedColors, color])
    } else {
      setSelectedColors(selectedColors.filter((c) => c !== color))
    }
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setSelectedSizes([])
    setSelectedColors([])
    setPriceRange([0, 500])
    setSearchQuery("")
  }

  const FilterSection = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-sm font-medium mb-2 block">
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </Label>
        <Slider value={priceRange} onValueChange={setPriceRange} max={500} min={0} step={10} className="w-full" />
      </div>

      {/* Categories */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Categories</Label>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => handleCategoryChange(category, checked)}
              />
              <Label htmlFor={category} className="text-sm">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Brands</Label>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={brand}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) => handleBrandChange(brand, checked)}
              />
              <Label htmlFor={brand} className="text-sm">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Sizes</Label>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <Checkbox
                id={size}
                checked={selectedSizes.includes(size)}
                onCheckedChange={(checked) => handleSizeChange(size, checked)}
              />
              <Label htmlFor={size} className="text-xs">
                {size}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Colors</Label>
        <div className="grid grid-cols-2 gap-2">
          {colors.map((color) => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox
                id={color}
                checked={selectedColors.includes(color)}
                onCheckedChange={(checked) => handleColorChange(color, checked)}
              />
              <Label htmlFor={color} className="text-sm">
                {color}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <Button variant="outline" onClick={clearAllFilters} className="w-full">
        Clear All Filters
      </Button>
    </div>
  )

  const handleAddToCart = (product) => {
    addItem(product, 1)
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        {/* Top Bar */}
        <div className="bg-gray-900 text-white py-2">
          <div className="container mx-auto px-4 flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                +1 (555) 123-4567
              </span>
              <span className="flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                support@store.com
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Free shipping on orders over $50</span>
              <div className="flex space-x-2">
                <Facebook className="w-4 h-4 cursor-pointer hover:text-gray-300" />
                <Twitter className="w-4 h-4 cursor-pointer hover:text-gray-300" />
                <Instagram className="w-4 h-4 cursor-pointer hover:text-gray-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <nav className="flex flex-col space-y-4 mt-8">
                  <Link href="/shop" className="text-lg font-medium hover:text-gray-600">
                    Shop
                  </Link>
                  <Link href="/categories" className="text-lg font-medium hover:text-gray-600">
                    Categories
                  </Link>
                  <Link href="/brands" className="text-lg font-medium hover:text-gray-600">
                    Brands
                  </Link>
                  <Link href="/collections" className="text-lg font-medium hover:text-gray-600">
                    Collections
                  </Link>
                  <Link href="#" className="text-lg font-medium hover:text-gray-600">
                    About
                  </Link>
                  <Link href="#" className="text-lg font-medium hover:text-gray-600">
                    Contact
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <div className="flex items-center">
              <Link href="/">
                <h1 className="text-2xl font-bold text-gray-900">StyleStore</h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/shop" className="text-gray-700 hover:text-gray-900 font-medium">
                Shop
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-gray-900 font-medium">
                Categories
              </Link>
              <Link href="/brands" className="text-gray-700 hover:text-gray-900 font-medium">
                Brands
              </Link>
              <Link href="/collections" className="text-gray-700 hover:text-gray-900 font-medium">
                Collections
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search products..." className="pl-10 bg-gray-50 border-gray-200" />
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <CartSheet />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <Filter className="h-4 w-4 text-gray-500" />
              </div>
              <Separator className="mb-6" />
              <FilterSection />
            </div>
          </div>

          {/* Products */}
          <div className="flex-1">
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredProducts.length} of {allProducts.length} products
              </p>
            </div>

            {viewMode === "grid" ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <Link href={`/product/${product.id}`}>
                        <div className="relative overflow-hidden rounded-t-lg">
                          <Image
                            src={`/placeholder.svg?height=250&width=300&query=${product.image}`}
                            alt={product.name}
                            width={300}
                            height={250}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.isOnSale && <Badge className="absolute top-2 left-2 bg-red-500">Sale</Badge>}
                        </div>
                      </Link>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <Link href={`/product/${product.id}`}>
                            <h3 className="font-semibold text-gray-900 hover:text-gray-700">{product.name}</h3>
                          </Link>
                          <Button size="icon" variant="ghost">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-gray-900">${product.price}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
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
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <Link href={`/product/${product.id}`}>
                          <div className="relative w-32 h-32 flex-shrink-0">
                            <Image
                              src={`/placeholder.svg?height=128&width=128&query=${product.image}`}
                              alt={product.name}
                              width={128}
                              height={128}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            {product.isOnSale && (
                              <Badge className="absolute top-1 left-1 bg-red-500 text-xs">Sale</Badge>
                            )}
                          </div>
                        </Link>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <Link href={`/product/${product.id}`}>
                                <h3 className="text-lg font-semibold text-gray-900 hover:text-gray-700 mb-1">
                                  {product.name}
                                </h3>
                              </Link>
                              <p className="text-gray-500 mb-2">{product.brand}</p>
                              <div className="flex items-center mb-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < Math.floor(product.rating)
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500 ml-2">({product.reviews} reviews)</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xl font-bold text-gray-900">${product.price}</span>
                                {product.originalPrice && (
                                  <span className="text-gray-500 line-through">${product.originalPrice}</span>
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

            {filteredProducts.length === 0 && (
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

      {/* Footer */}
      <footer className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">StyleStore</h3>
              <p className="text-gray-600 mb-4">
                Your premier destination for fashion and style. We bring you the latest trends and timeless classics.
              </p>
              <div className="flex space-x-4">
                <Facebook className="w-5 h-5 text-gray-600 hover:text-gray-900 cursor-pointer" />
                <Twitter className="w-5 h-5 text-gray-600 hover:text-gray-900 cursor-pointer" />
                <Instagram className="w-5 h-5 text-gray-600 hover:text-gray-900 cursor-pointer" />
                <Youtube className="w-5 h-5 text-gray-600 hover:text-gray-900 cursor-pointer" />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    Size Guide
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    Returns
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Customer Service</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    Track Your Order
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-gray-600 mr-2" />
                  <span className="text-gray-600 text-sm">123 Fashion St, Style City, SC 12345</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-gray-600 mr-2" />
                  <span className="text-gray-600 text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gray-600 mr-2" />
                  <span className="text-gray-600 text-sm">support@stylestore.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">© 2024 StyleStore. All rights reserved.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-gray-600 text-sm">We accept:</span>
              <div className="flex space-x-2">
                <div className="w-8 h-5 bg-gray-300 rounded"></div>
                <div className="w-8 h-5 bg-gray-300 rounded"></div>
                <div className="w-8 h-5 bg-gray-300 rounded"></div>
                <div className="w-8 h-5 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
