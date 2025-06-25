import { BarChart3, Box, Home, ImageIcon, LayoutGrid, Package, Settings, ShoppingBag, Tag } from "lucide-react";

export const navigationLinks = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Products", href: "/dashboard/products", icon: Package },
    { name: "Categories", href: "/dashboard/categories", icon: LayoutGrid },
    { name: "Brands", href: "/dashboard/brands", icon: Tag },
    { name: "Collections", href: "/dashboard/collections", icon: Box },
    { name: "Banners", href: "/dashboard/banners", icon: ImageIcon },
    { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]