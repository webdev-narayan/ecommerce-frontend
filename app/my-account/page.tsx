"use client"

import { useState } from "react"
import { DashboardSidebar } from "./components/dashboard-sidebar"
import { OrdersSection } from "./components/orders-section"
import { ProfileSection } from "./components/profile-section"
import { AddressesSection } from "./components/addresses-section"
import { SettingsSection } from "./components/settings-section"
import CustomerLogin from "./components/customer-login"
import { useAuth } from "@/contexts/auth-context"
import { redirect } from "next/navigation"
import Login from "../login/page"

export default function CustomerDashboard() {
    const [activeSection, setActiveSection] = useState("orders")
    const { isAuthenticated, loading } = useAuth()

    const renderContent = () => {
        switch (activeSection) {
            case "orders":
                return <OrdersSection />
            case "profile":
                return <ProfileSection />
            case "addresses":
                return <AddressesSection />
            case "settings":
                return <SettingsSection />
            default:
                return <OrdersSection />
        }
    }

    return (
        <section className="px-4">
            {!isAuthenticated && !loading ?
                <div className="max-w-md mx-auto mt-16 mb-12">
                    <Login />
                </div>
                : <>
                    <div className="w-full max-w-7xl mx-auto mt-10 mb-10 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                        <div className="flex flex-col md:flex-row min-h-[400px] md:h-[600px]">
                            <DashboardSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
                            <main className="flex-1 overflow-y-auto">
                                <div className="p-4 sm:p-6">{renderContent()}</div>
                            </main>
                        </div>
                    </div >
                </>
            }
        </section>
    )
}
