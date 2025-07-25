import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"

const NotFound = () => {
  return (
    <div className="container mx-auto border min-h-[60vh] flex flex-col gap-4 justify-center items-center">
      <h3 className="font-bold text-2xl">We're Sorry 🥹</h3>
      <p>We could not found, you are looking for!</p>
      <Button onClick={() => redirect("/shop")}>Try Exploring</Button>
    </div>
  )
}

export default NotFound