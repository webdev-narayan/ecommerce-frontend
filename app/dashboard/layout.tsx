"use server"
import { getUser, logout } from '@/lib/auth';
import { redirect } from "next/navigation"
import DashboardSidebar from './components/SideBar';
export default async function DashboardLayout({ children, }: { children: React.ReactNode }) {

  const user = await getUser()
  if (!user || user.role.type !== "admin") {
    redirect("/auth")
  }


  // if (loading) return <div>Loading...</div>

  return (
    <div className="flex h-screen bg-gray-100">

      <DashboardSidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
