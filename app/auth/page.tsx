import LoginForm from "./components/LoginForm"
import { getUser } from "@/lib/auth"
import { redirect } from 'next/navigation';

export default async function AuthPage() {
  const user = await getUser()

  if (user) {
    redirect("/dashboard")
  }
  return (
    <LoginForm />
  )
}
