"use client"

import { useState } from "react"
import { User, Package, MapPin, Settings, LogOut, Menu } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { mockUser } from "@/lib/mock-api"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface DashboardSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  className?: string
}

const menuItems = [
  {
    title: "Orders",
    icon: Package,
    key: "orders",
  },
  {
    title: "Profile",
    icon: User,
    key: "profile",
  },
  {
    title: "Addresses",
    icon: MapPin,
    key: "addresses",
  },
  {
    title: "Settings",
    icon: Settings,
    key: "settings",
  },
]
function SidebarContent({
  activeSection,
  onSectionChange,
  onItemClick,
}: {
  activeSection: string
  onSectionChange: (section: string) => void
  onItemClick?: () => void
}) {
  return (
    <div className="flex flex-col h-full bg-slate-50/50 border-r border-slate-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={mockUser.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-slate-200 text-slate-700">
              {mockUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{mockUser.name}</p>
            <p className="text-xs text-slate-500 truncate">{mockUser.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.key}
              variant={activeSection === item.key ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-10 px-3 cursor-pointer",
                activeSection === item.key
                  ? "bg-slate-100 text-slate-900 border-gray-300 border"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
              )}
              onClick={() => {
                onSectionChange(item.key)
                onItemClick?.()
              }}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.title}</span>
            </Button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-slate-200">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-10 px-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          onClick={() => {
            console.log("Logging out...")
            onItemClick?.()
          }}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Log Out</span>
        </Button>
      </div>
    </div>
  )
}

export function DashboardSidebar({ activeSection, onSectionChange, className }: DashboardSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="mb-4 border-slate-200 bg-transparent">
              <Menu className="h-4 w-4 mr-2" />
              Menu
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent
              activeSection={activeSection}
              onSectionChange={onSectionChange}
              onItemClick={() => setMobileOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className={cn("hidden md:flex flex-col w-64 shrink-0", className)}>
        <SidebarContent activeSection={activeSection} onSectionChange={onSectionChange} />
      </div>
    </>
  )
}
