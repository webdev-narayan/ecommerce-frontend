/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { navigationLinks } from "../utils/constants"
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import { Button } from "@/components/ui/button"
// import { LogOut, Menu, Settings, User } from "lucide-react"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { logout } from "@/lib/auth"

// export default function DashboardSidebar() {
//     const pathname = usePathname()

//     return (
//         <>
//             {/* Mobile Sidebar */}
//             <div className="md:hidden p-2">
//                 <Sheet>
//                     <SheetTrigger asChild>
//                         <Button variant="outline" size="icon">
//                             <Menu className="h-5 w-5" />
//                         </Button>
//                     </SheetTrigger>
//                     <SheetContent side="left" className="w-[250px] p-0 flex-col flex justify-between">
//                         <div>
//                             <div className="p-4 border-b">
//                                 <h1 className="text-xl font-bold tracking-tight text-gray-800">SuperCommercxe</h1>
//                             </div>
//                             <nav className="flex flex-col gap-1 p-2">
//                                 {navigationLinks.map((item) => (
//                                     <Link
//                                         key={item.href}
//                                         href={item.href}
//                                         className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${pathname === item.href
//                                             ? "bg-gray-200 text-black"
//                                             : "text-gray-700 hover:bg-gray-100"
//                                             }`}
//                                     >
//                                         <item.icon className="h-4 w-4" />
//                                         {item.name}
//                                     </Link>
//                                 ))}
//                             </nav>
//                         </div>

//                         <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                                 <Button variant="ghost" className="w-full justify-start p-2 text-left text-sm">
//                                     <div className="flex items-center gap-2">
//                                         <Avatar className="h-6 w-6">
//                                             <AvatarFallback>N</AvatarFallback>
//                                         </Avatar>
//                                         <div>
//                                             <div className="font-medium">Admin User</div>
//                                             <div className="text-xs text-gray-500">admin@example.com</div>
//                                         </div>
//                                     </div>
//                                 </Button>
//                             </DropdownMenuTrigger>

//                             <DropdownMenuContent className="w-56 ">
//                                 <DropdownMenuLabel>My Account</DropdownMenuLabel>
//                                 <DropdownMenuSeparator />

//                                 <Link href="/dashboard/profile" passHref>
//                                     <DropdownMenuItem asChild>
//                                         <span className="flex items-center">
//                                             <User className="mr-2 h-4 w-4" /> Profile
//                                         </span>
//                                     </DropdownMenuItem>
//                                 </Link>

//                                 <Link href="/dashboard/settings" passHref>
//                                     <DropdownMenuItem asChild>
//                                         <span className="flex items-center">
//                                             <Settings className="mr-2 h-4 w-4" /> Settings
//                                         </span>
//                                     </DropdownMenuItem>
//                                 </Link>

//                                 <DropdownMenuSeparator />

//                                 <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-700">
//                                     <LogOut className="mr-2 h-4 w-4" /> Logout
//                                 </DropdownMenuItem>
//                             </DropdownMenuContent>
//                         </DropdownMenu>

//                     </SheetContent>
//                 </Sheet>
//             </div>

//             {/* Desktop Sidebar */}
//             <div className="hidden md:flex md:flex-col md:w-64 md:border-r md:bg-white md:shadow-sm">
//                 <div className="p-4 border-b">
//                     <h1 className="text-xl font-bold tracking-tight text-gray-800">SuperCommercxe</h1>
//                 </div>
//                 <div className="flex flex-col h-full justify-between p-4">
//                     <nav className="flex-1 space-y-2">
//                         {navigationLinks.map((item) => (
//                             <Link
//                                 key={item.href}
//                                 href={item.href}
//                                 className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${pathname === item.href
//                                     ? "bg-gray-200 text-black"
//                                     : "text-gray-700 hover:bg-gray-100"
//                                     }`}
//                             >
//                                 <item.icon className="h-4 w-4" />
//                                 {item.name}
//                             </Link>
//                         ))}
//                     </nav>

//                     <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                             <Button variant="ghost" className="w-full justify-start p-2 text-left text-sm">
//                                 <div className="flex items-center gap-2">
//                                     <Avatar className="h-6 w-6">
//                                         <AvatarFallback>N</AvatarFallback>
//                                     </Avatar>
//                                     <div>
//                                         <div className="font-medium">Admin User</div>
//                                         <div className="text-xs text-gray-500">admin@example.com</div>
//                                     </div>
//                                 </div>
//                             </Button>
//                         </DropdownMenuTrigger>

//                         <DropdownMenuContent className="w-56">
//                             <DropdownMenuLabel>My Account</DropdownMenuLabel>
//                             <DropdownMenuSeparator />

//                             <Link href="/dashboard/profile" passHref>
//                                 <DropdownMenuItem asChild>
//                                     <span className="flex items-center">
//                                         <User className="mr-2 h-4 w-4" /> Profile
//                                     </span>
//                                 </DropdownMenuItem>
//                             </Link>

//                             <Link href="/dashboard/settings" passHref>
//                                 <DropdownMenuItem asChild>
//                                     <span className="flex items-center">
//                                         <Settings className="mr-2 h-4 w-4" /> Settings
//                                     </span>
//                                 </DropdownMenuItem>
//                             </Link>

//                             <DropdownMenuSeparator />

//                             <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-700">
//                                 <LogOut className="mr-2 h-4 w-4" /> Logout
//                             </DropdownMenuItem>
//                         </DropdownMenuContent>
//                     </DropdownMenu>

//                 </div>
//             </div>
//         </>
//     )
// }

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
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
import { LogOut, Menu, Settings, User, ChevronDown, ChevronRight } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { logout } from "@/lib/auth"

// NavItem component for handling sub-menus
function NavItem({ item, pathname, isMobile = false }: any) {
    const [isOpen, setIsOpen] = useState(false)
    const hasSubLinks = item.sub_links && item.sub_links.length > 0

    // Check if current path matches main link or any sub-link
    const isActive = pathname === item.href ||
        (hasSubLinks && item.sub_links.some((subLink: { href: any }) => pathname === subLink.href))


    if (!hasSubLinks) {
        return (
            <Link
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${isActive
                    ? "bg-gray-100 text-black"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
            >
                <item.icon className="h-4 w-4" />
                {item.name}
            </Link>
        )
    }

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-medium ${isActive
                    ? "bg-gray-200 text-black"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
            >
                <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    {item.name}
                </div>
                {isOpen ? (
                    <ChevronDown className="h-4 w-4" />
                ) : (
                    <ChevronRight className="h-4 w-4" />
                )}
            </button>

            {isOpen && (
                <div className="ml-4 mt-1 space-y-1">
                    {item.sub_links.map((subLink: any) => (
                        <Link
                            key={subLink.href}
                            href={subLink.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded text-sm ${pathname === subLink.href
                                ? "border-b text-black font-semibold"
                                : "text-gray-600 hover:bg-gray-100 font-medium"
                                }`}
                        >
                            <subLink.icon className="h-3 w-3" />
                            {subLink.name}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

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
                    <SheetContent side="left" className="w-[280px] p-0 flex-col flex justify-between">
                        <div className="flex flex-col h-full">
                            <div className="p-4 border-b">
                                <h1 className="text-xl font-bold tracking-tight text-gray-800">SuperCommercxe</h1>
                            </div>
                            <nav className="flex-1 overflow-y-auto">
                                <div className="flex flex-col gap-1 p-2">
                                    {navigationLinks.map((item) => (
                                        <NavItem
                                            key={item.href}
                                            item={item}
                                            pathname={pathname}
                                            isMobile={true}
                                        />
                                    ))}
                                </div>
                            </nav>
                        </div>

                        <div className="p-2 border-t">
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
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden md:flex md:flex-col md:w-64 md:border-r md:bg-white md:shadow-sm">
                <div className="p-4 border-b">
                    <h1 className="text-xl font-bold tracking-tight text-gray-800">SuperCommercxe</h1>
                </div>
                <div className="flex flex-col h-full justify-between">
                    <nav className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-2">
                            {navigationLinks.map((item) => (
                                <NavItem
                                    key={item.href}
                                    item={item}
                                    pathname={pathname}
                                    isMobile={false}
                                />
                            ))}
                        </div>
                    </nav>

                    <div className="p-4 border-t">
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
            </div>
        </>
    )
}