"use client"

import { useGlobal } from "@/contexts/global-context"
import { noHeaderFooterRoutes } from "@/lib/constants"
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const quick_links = [
  { name: "About Us", link: "/about-us" },
  { name: "Contact Us", link: "/contact-us" },
  { name: "Privacy Policy", link: "/privacy-policy" },
  { name: "Terms and Condition", link: "/terms-and-condition" },
]

export function Footer() {
  const path = usePathname()
  const hideHeaderFooter = noHeaderFooterRoutes.some((route) => path.startsWith(route))
  const { publicInfo, loading } = useGlobal()
  if (hideHeaderFooter) return null

  if (loading) {
    return null
  }

  return (
    <footer className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{publicInfo?.store_name}</h3>
            <p className="text-gray-600 mb-4">
              {publicInfo?.description}
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
              <div className="flex items-start">
                <MapPin className="w-4 h-4 text-gray-600 mr-2 mt-0.5 shrink-0" />
                <span className="text-gray-600 text-sm">{publicInfo?.address || ""}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-gray-600 mr-2 shrink-0" />
                <span className="text-gray-600 text-sm">{!publicInfo?.phone.includes("+91") && "+91"} {publicInfo?.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-gray-600 mr-2 shrink-0" />
                <span className="text-gray-600 text-sm">{publicInfo?.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm text-center md:text-left">© 2024 {publicInfo?.store_name || ""}. All rights reserved.</p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
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
  )
}
