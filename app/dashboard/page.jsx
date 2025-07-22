"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Box, DollarSign, Package, ShoppingCart, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500">Welcome back to your store dashboard.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/shop">
            <Button variant="outline" size="sm">
              View Store
            </Button>
          </Link>
          <Link href="/dashboard/products">
            <Button size="sm">Add Product</Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹45,231.89</div>
                <p className="text-xs text-gray-500">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-gray-500">+12.4% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
                <Package className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">248</div>
                <p className="text-xs text-gray-500">+8 added today</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-gray-500">+180 this week</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>You made 265 sales this month.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: 1,
                      name: "Dinesh",
                      email: "dins@gmail.com"
                    },
                    {
                      id: 2,
                      name: "Mitali",
                      email: "mitali002@gmail.com"
                    },
                    {
                      id: 3,
                      name: "Avi Raj",
                      email: "araj998@gmail.com"
                    },
                    {
                      id: 4,
                      name: "Shiv",
                      email: "shivss343@gmail.com"
                    },
                  ].map((customer) => (
                    <div key={customer.id} className="flex items-center">
                      <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        <Users className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <p className="text-sm font-medium leading-none">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                      </div>
                      <div className="font-medium">₹{(Math.random() * 1000).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/orders">
                  <Button variant="outline" size="sm" className="w-full">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Your best selling products this month.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Classic White Sneakers", sales: 89, stock: 35 },
                    { name: "Denim Jacket", sales: 74, stock: 12 },
                    { name: "Wireless Headphones", sales: 68, stock: 26 },
                    { name: "Leather Wallet", sales: 52, stock: 41 },
                    { name: "Smartwatch", sales: 47, stock: 8 },
                  ].map((product, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium leading-none">{product.name}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          {product.sales} sales
                          <ArrowUpRight className="ml-1 h-3 w-3 text-green-500" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="w-full max-w-[180px]">
                          <Progress value={(product.stock / 50) * 100} className="h-2" />
                        </div>
                        <span className="text-gray-500 ml-2">{product.stock} in stock</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/products">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Recent Categories</CardTitle>
                <CardDescription>Your recently added categories.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {["Electronics", "Clothing", "Home & Kitchen", "Beauty", "Sports"].map((category, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Box className="mr-2 h-4 w-4 text-gray-500" />
                        <span className="text-sm">{category}</span>
                      </div>
                      <span className="text-xs text-gray-500">{Math.floor(Math.random() * 100)} products</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/categories">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Categories
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Brands</CardTitle>
                <CardDescription>Your recently added brands.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {["Nike", "Apple", "Samsung", "Adidas", "Sony"].map((brand, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded bg-gray-200 mr-2" />
                        <span className="text-sm">{brand}</span>
                      </div>
                      <span className="text-xs text-gray-500">{Math.floor(Math.random() * 50)} products</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/brands">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Brands
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Collections</CardTitle>
                <CardDescription>Your recently added collections.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {["Summer Sale", "New Arrivals", "Bestsellers", "Winter Collection", "Clearance"].map(
                    (collection, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-6 w-6 rounded bg-gray-200 mr-2" />
                          <span className="text-sm">{collection}</span>
                        </div>
                        <span className="text-xs text-gray-500">{Math.floor(Math.random() * 30)} products</span>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/collections">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Collections
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
