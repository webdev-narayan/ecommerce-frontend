"use client"

import Image from "next/image"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrencyString } from "use-shopping-cart"

export function CartItem({ item, removeItem }) {
  return (
    <div className="flex items-center justify-between space-x-4 py-2">
      <div className="flex items-center space-x-2">
        <div className="relative h-16 w-16">
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            fill
            className="object-cover rounded-md"
            sizes="(max-width: 768px) 25vw, (max-width: 1200px) 20vw, 15vw"
          />
        </div>
        <div>
          <h3 className="text-sm font-medium">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.brand}</p>
          <p className="text-xs text-gray-500">
            {formatCurrencyString({
              value: item.price,
              currency: "USD",
            })}
          </p>
          <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
