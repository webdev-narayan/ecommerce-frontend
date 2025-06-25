"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { navigationLinks } from "../utils/constants"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { LogOut, Menu, Settings, User } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { logout } from "@/lib/auth"

export default function DashboardSidebar() {
    const pathname = usePathname()

    return (
        <>
            {/* Mobile Sidebar */}
            <div className="md:hidden p-2">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[250px] p-0 flex-col flex justify-between">
                        <div>
                            <div className="p-4 border-b">
                                <h1 className="text-xl font-bold tracking-tight text-gray-800">SuperCommercxe</h1>
                            </div>
                            <nav className="flex flex-col gap-1 p-2">
                                {navigationLinks.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${pathname === item.href
                                            ? "bg-gray-200 text-black"
                                            : "text-gray-700 hover:bg-gray-100"
                                            }`}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="w-full justify-start p-2 text-left text-sm">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarFallback>N</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">Admin User</div>
                                            <div className="text-xs text-gray-500">admin@example.com</div>
                                        </div>
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-56 ">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                <Link href="/dashboard/profile" passHref>
                                    <DropdownMenuItem asChild>
                                        <span className="flex items-center">
                                            <User className="mr-2 h-4 w-4" /> Profile
                                        </span>
                                    </DropdownMenuItem>
                                </Link>

                                <Link href="/dashboard/settings" passHref>
                                    <DropdownMenuItem asChild>
                                        <span className="flex items-center">
                                            <Settings className="mr-2 h-4 w-4" /> Settings
                                        </span>
                                    </DropdownMenuItem>
                                </Link>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-700">
                                    <LogOut className="mr-2 h-4 w-4" /> Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden md:flex md:flex-col md:w-64 md:border-r md:bg-white md:shadow-sm">
                <div className="p-4 border-b">
                    <h1 className="text-xl font-bold tracking-tight text-gray-800">SuperCommercxe</h1>
                </div>
                <div className="flex flex-col h-full justify-between p-4">
                    <nav className="flex-1 space-y-2">
                        {navigationLinks.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${pathname === item.href
                                    ? "bg-gray-200 text-black"
                                    : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="w-full justify-start p-2 text-left text-sm">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarFallback>N</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">Admin User</div>
                                        <div className="text-xs text-gray-500">admin@example.com</div>
                                    </div>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <Link href="/dashboard/profile" passHref>
                                <DropdownMenuItem asChild>
                                    <span className="flex items-center">
                                        <User className="mr-2 h-4 w-4" /> Profile
                                    </span>
                                </DropdownMenuItem>
                            </Link>

                            <Link href="/dashboard/settings" passHref>
                                <DropdownMenuItem asChild>
                                    <span className="flex items-center">
                                        <Settings className="mr-2 h-4 w-4" /> Settings
                                    </span>
                                </DropdownMenuItem>
                            </Link>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-700">
                                <LogOut className="mr-2 h-4 w-4" /> Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </div>
        </>
    )
}
