"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAddress } from "@/hooks/use-address"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { Switch } from "../ui/switch"

export function AddressSelection() {
  const [showAddressSheet, setShowAddressSheet] = useState(false)
  const { addresses, selectedAddress, setSelectedAddress, addAddress } = useAddress()

  const handleAddAddress = (formData: FormData) => {
    const newAddress = {
      id: 1,
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      city: formData.get("city") as string,
      line1: formData.get("line1") as string,
      state: formData.get("state") as string,
      country: formData.get("country") as string,
      pincode: formData.get("pincode") as string,
      is_default: false,
    }

    addAddress(newAddress)
    setShowAddressSheet(false)
  }

  return (
    <div>
      <h3 className="font-medium mb-3 flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Delivery Address
      </h3>

      <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
        {addresses.map((address) => (
          <div key={address.id} className="flex items-start space-x-3 p-3 border rounded-lg">
            <RadioGroupItem value={address.id?.toString()} id={address.id.toString()} className="mt-1" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Label htmlFor={address.id.toString()} className="font-medium text-sm">
                  {address.name}
                </Label>
                {address.is_default && (
                  <Badge variant="secondary" className="text-xs">
                    Default
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {address.line1}, {address.city}, {address.state} - {address.pincode}
              </p>
              <p className="text-xs text-gray-600">{address.phone}</p>
            </div>
          </div>
        ))}
      </RadioGroup>

      <Sheet>
        <SheetTrigger>
          {/* <Button variant="outline" className="w-full mt-4 bg-transparent"> */}
          <div className="">
            Add New Address
          </div>
          {/* </Button> */}
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              Add New Address
            </SheetTitle>
          </SheetHeader>

          <form action={handleAddAddress} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Address name" required />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" placeholder="Phone number" required />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" placeholder="Email" required />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="line1">Address Line 1</Label>
              <Textarea id="line1" name="line1" placeholder="Address Line 1" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" placeholder="City" required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="state" >State</Label>
                <Select name="state" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="gujarat">Gujarat</SelectItem>
                    <SelectItem value="rajasthan">Rajasthan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="pincode">Pincode</Label>
              <Input id="pincode" name="pincode" placeholder="Pincode" required />
            </div>
            <div className="flex items-center gap-4">
              <Label htmlFor="is_default">Make This Default</Label>
              <Switch
                id="is_default"
                name="is_default"
                // checked={selectedAddress?.is_default}
                checked={true}
              />
            </div>
            <Button type="submit" className="w-full">
              Save Address
            </Button>
          </form>

        </SheetContent>
      </Sheet>
    </div>
  )
}
