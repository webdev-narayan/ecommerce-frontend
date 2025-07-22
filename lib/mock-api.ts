import { type User, type Order, type Address, OrderStatus, PaymentStatus, PaymentMethods } from "./types/type"

// Mock user data
export const mockUser: User = {
  id: 1,
  documentId: "user_123",
  username: "john_doe",
  confirmed: true,
  blocked: false,
  name: "John Doe",
  phone: "+91 9876543210",
  email: "john.doe@example.com",
  avatar: "/placeholder.svg?height=100&width=100&text=JD",
}

// Mock orders data
export const mockOrders: Order[] = [
  {
    user: mockUser,
    order_id: "ORD-2024-001",
    total_amount: 2398.0,
    order_status: OrderStatus.DELIVERED,
    payment_status: PaymentStatus.PAID,
    payment_method: PaymentMethods.PREPAID,
    order_date: new Date("2024-01-15"),
    deliver_date: new Date("2024-01-20"),
    customer_name: "John Doe",
    customer_phone: "+91 9876543210",
    customer_email: "john.doe@example.com",
    notes: "Handle with care",
    is_shipping_billing: true,
    shipping_address: {
      id: 1,
      name: "John Doe",
      phone: "+91 9876543210",
      email: "john.doe@example.com",
      line1: "123 Main St",
      line2: "Apartment 4B",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      country: "India",
      is_default: true,
      user: mockUser,
    },
    order_products: [
      {
        id: 1,
        documentId: "prod_1",
        order: {} as Order,
        product: {
          id: 1,
          title: "CR7 Perfume Set",
          slug: "cr7-perfume-set",
          description: "Premium fragrance collection",
          price: "1199.00",
          thumbnail: {
            id: 1,
            url: "/placeholder.svg?height=80&width=80&text=CR7",
            alt: "CR7 Perfume",
            documentId: "media_1",
          },
          is_featured: true,
          category: { id: 1, name: "Fragrances" },
          brand: { id: 1, name: "CR7" },
        },
        product_variant: {
          id: 1,
          sku: "CR7-001",
          price: 1199.0,
          quantity: 10,
          mrp: "1399.00",
          product: {} as any,
        },
        quantity: 2,
        price: 1199.0,
        total_amount: 2398.0,
      },
    ],
  },
  {
    user: mockUser,
    order_id: "ORD-2024-002",
    total_amount: 1599.0,
    order_status: OrderStatus.SHIPPED,
    payment_status: PaymentStatus.PAID,
    payment_method: PaymentMethods.COD,
    order_date: new Date("2024-01-10"),
    deliver_date: new Date("2024-01-18"),
    customer_name: "John Doe",
    customer_phone: "+91 9876543210",
    customer_email: "john.doe@example.com",
    notes: "",
    is_shipping_billing: true,
    shipping_address: {
      id: 1,
      name: "John Doe",
      phone: "+91 9876543210",
      email: "john.doe@example.com",
      line1: "123 Main St",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      country: "India",
      is_default: true,
      user: mockUser,
    },
    order_products: [
      {
        id: 2,
        documentId: "prod_2",
        order: {} as Order,
        product: {
          id: 2,
          title: "Premium Watch",
          slug: "premium-watch",
          description: "Luxury timepiece",
          price: "1599.00",
          thumbnail: {
            id: 2,
            url: "/placeholder.svg?height=80&width=80&text=Watch",
            alt: "Premium Watch",
            documentId: "media_2",
          },
          is_featured: true,
          category: { id: 2, name: "Accessories" },
          brand: { id: 2, name: "Luxury Brand" },
        },
        product_variant: {
          id: 2,
          sku: "WATCH-001",
          price: 1599.0,
          quantity: 5,
          mrp: "1799.00",
          product: {} as any,
        },
        quantity: 1,
        price: 1599.0,
        total_amount: 1599.0,
      },
    ],
  },
  {
    user: mockUser,
    order_id: "ORD-2024-003",
    total_amount: 899.0,
    order_status: OrderStatus.CANCELLED,
    payment_status: PaymentStatus.REFUNDED,
    payment_method: PaymentMethods.PREPAID,
    order_date: new Date("2024-01-05"),
    deliver_date: new Date("2024-01-12"),
    customer_name: "John Doe",
    customer_phone: "+91 9876543210",
    customer_email: "john.doe@example.com",
    notes: "Customer requested cancellation",
    is_shipping_billing: true,
    shipping_address: {
      id: 2,
      name: "John Doe",
      phone: "+91 9876543210",
      email: "john.doe@example.com",
      line1: "456 Park Avenue",
      city: "Raipur",
      state: "Chhattisgarh",
      pincode: "492001",
      country: "India",
      is_default: false,
      user: mockUser,
    },
    order_products: [
      {
        id: 3,
        documentId: "prod_3",
        order: {} as Order,
        product: {
          id: 3,
          title: "Sports Shoes",
          slug: "sports-shoes",
          description: "Comfortable running shoes",
          price: "899.00",
          thumbnail: {
            id: 3,
            url: "/placeholder.svg?height=80&width=80&text=Shoes",
            alt: "Sports Shoes",
            documentId: "media_3",
          },
          is_featured: false,
          category: { id: 3, name: "Footwear" },
          brand: { id: 3, name: "Sports Brand" },
        },
        product_variant: {
          id: 3,
          sku: "SHOES-001",
          price: 899.0,
          quantity: 15,
          mrp: "999.00",
          product: {} as any,
        },
        quantity: 1,
        price: 899.0,
        total_amount: 899.0,
      },
    ],
  },
]

// Mock addresses data
export const mockAddresses: Address[] = [
  {
    id: 1,
    name: "John Doe",
    phone: "+91 9876543210",
    email: "john.doe@example.com",
    line1: "123 Main St",
    line2: "Apartment 4B",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    country: "India",
    is_default: true,
    user: mockUser,
  },
  {
    id: 2,
    name: "John Doe",
    phone: "+91 9876543210",
    email: "john.doe@example.com",
    line1: "456 Park Avenue",
    city: "Raipur",
    state: "Chhattisgarh",
    pincode: "492001",
    country: "India",
    is_default: false,
    user: mockUser,
  },
]

// Mock API functions
export const api = {
  // User APIs
  async getUser(): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockUser
  },

  async updateUser(userData: Partial<User>): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 800))
    return { ...mockUser, ...userData }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // Mock validation
    if (currentPassword === "oldpassword") {
      return true
    }
    throw new Error("Current password is incorrect")
  },

  // Orders APIs
  async getOrders(filters?: { status?: string; search?: string }): Promise<Order[]> {
    await new Promise((resolve) => setTimeout(resolve, 600))
    let filteredOrders = [...mockOrders]

    if (filters?.status && filters.status !== "all") {
      filteredOrders = filteredOrders.filter((order) => order.order_status === filters.status)
    }

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.order_id.toLowerCase().includes(searchTerm) || order.customer_name.toLowerCase().includes(searchTerm),
      )
    }

    return filteredOrders
  },

  async getOrder(orderId: string): Promise<Order | null> {
    await new Promise((resolve) => setTimeout(resolve, 400))
    return mockOrders.find((order) => order.order_id === orderId) || null
  },

  // Address APIs
  async getAddresses(): Promise<Address[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockAddresses
  },

  async addAddress(address: Omit<Address, "id" | "user">): Promise<Address> {
    await new Promise((resolve) => setTimeout(resolve, 800))
    const newAddress: Address = {
      ...address,
      id: mockAddresses.length + 1,
      user: mockUser,
    }
    mockAddresses.push(newAddress)
    return newAddress
  },

  async updateAddress(id: number, address: Partial<Address>): Promise<Address> {
    await new Promise((resolve) => setTimeout(resolve, 700))
    const index = mockAddresses.findIndex((addr) => addr.id === id)
    if (index !== -1) {
      mockAddresses[index] = { ...mockAddresses[index], ...address }
      return mockAddresses[index]
    }
    throw new Error("Address not found")
  },

  async deleteAddress(id: number): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = mockAddresses.findIndex((addr) => addr.id === id)
    if (index !== -1) {
      mockAddresses.splice(index, 1)
      return true
    }
    return false
  },

  async setDefaultAddress(id: number): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 600))
    mockAddresses.forEach((addr) => {
      addr.is_default = addr.id === id
    })
    return true
  },
}
