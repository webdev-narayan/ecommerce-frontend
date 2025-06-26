import { Archive, BarChart3, Box, Home, ImageIcon, LayoutGrid, List, Package, Plus, Settings, ShoppingBag, Tag, TicketPercent } from "lucide-react";

export const navigationLinks = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home
  },
  {
    name: "Products",
    href: "/dashboard/products",
    icon: Package,
    sub_links: [
      {
        name: "All Products",
        icon: List,
        href: "/dashboard/products"
      },
      {
        name: "Add Product",
        icon: Plus,
        href: "/dashboard/products/create"
      },
      {
        name: "Attributes",
        icon: Archive,
        href: "/dashboard/products/attributes"
      },
      {
        name: "Categories",
        href: "/dashboard/categories",
        icon: LayoutGrid
      },
      {
        name: "Brands",
        href: "/dashboard/brands",
        icon: Tag
      },
    ]
  },

  {
    name: "Collections",
    href: "/dashboard/collections",
    icon: Box
  },
  {
    name: "Coupons",
    href: "/dashboard/coupons",
    icon: TicketPercent
  },
  {
    name: "Banners",
    href: "/dashboard/banners",
    icon: ImageIcon
  },
  {
    name: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingBag
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings
  },
]