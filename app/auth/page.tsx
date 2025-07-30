"use server"
import LoginForm from "./components/LoginForm"
import { getUser, logout } from "@/lib/auth"
import { redirect } from 'next/navigation';

export default async function AuthPage() {
  const user = await getUser()

  if (user && user.role.type === "admin") {
    redirect("/dashboard")
  }
  return (
    <LoginForm />
  )
}
