"use client"

import { useState, useEffect } from "react"
import { Plus, Edit3, MapPin, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import type { Address } from "@/lib/types/type"
import { api } from "@/lib/mock-api"

export function AddressesSection() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    email: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    is_default: false,
  })

  useEffect(() => {
    loadAddresses()
  }, [])

  const loadAddresses = async () => {
    try {
      setLoading(true)
      const data = await api.getAddresses()
      setAddresses(data)
    } catch (error) {
      console.error("Failed to load addresses:", error)
      toast({
        title: "Error",
        description: "Failed to load addresses",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddAddress = async () => {
    try {
      setSaving(true)
      const address = await api.addAddress(newAddress)
      setAddresses([...addresses, address])
      setNewAddress({
        name: "",
        phone: "",
        email: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        is_default: false,
      })
      setIsAddingNew(false)
      toast({
        title: "Success",
        description: "Address added successfully",
      })
    } catch (error) {
      console.error("Failed to add address:", error)
      toast({
        title: "Error",
        description: "Failed to add address",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSetDefault = async (id: number) => {
    try {
      await api.setDefaultAddress(id)
      setAddresses(
        addresses.map((addr) => ({
          ...addr,
          is_default: addr.id === id,
        })),
      )
      toast({
        title: "Success",
        description: "Default address updated",
      })
    } catch (error) {
      console.error("Failed to set default address:", error)
      toast({
        title: "Error",
        description: "Failed to update default address",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAddress = async (id: number) => {
    try {
      await api.deleteAddress(id)
      setAddresses(addresses.filter((addr) => addr.id !== id))
      toast({
        title: "Success",
        description: "Address deleted successfully",
      })
    } catch (error) {
      console.error("Failed to delete address:", error)
      toast({
        title: "Error",
        description: "Failed to delete address",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-32 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-64"></div>
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-slate-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Addresses</h2>
          <p className="text-slate-600 mt-1">Manage your delivery addresses</p>
        </div>
        <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
          <DialogTrigger asChild>
            <Button className="bg-slate-900 hover:bg-slate-800 w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
              <DialogDescription>Add a new delivery address to your account</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="new-name"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                  className="border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-phone" className="text-sm font-medium">
                  Phone
                </Label>
                <Input
                  id="new-phone"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  className="border-slate-200"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="new-email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newAddress.email}
                  onChange={(e) => setNewAddress({ ...newAddress, email: e.target.value })}
                  className="border-slate-200"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="new-line1" className="text-sm font-medium">
                  Address Line 1
                </Label>
                <Input
                  id="new-line1"
                  value={newAddress.line1}
                  onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                  className="border-slate-200"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="new-line2" className="text-sm font-medium">
                  Address Line 2 (Optional)
                </Label>
                <Input
                  id="new-line2"
                  value={newAddress.line2}
                  onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })}
                  className="border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-city" className="text-sm font-medium">
                  City
                </Label>
                <Input
                  id="new-city"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  className="border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-state" className="text-sm font-medium">
                  State
                </Label>
                <Input
                  id="new-state"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  className="border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-pincode" className="text-sm font-medium">
                  Pincode
                </Label>
                <Input
                  id="new-pincode"
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                  className="border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-country" className="text-sm font-medium">
                  Country
                </Label>
                <Input
                  id="new-country"
                  value={newAddress.country}
                  onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                  className="border-slate-200"
                />
              </div>
              <div className="flex items-center space-x-2 md:col-span-2">
                <Switch
                  id="new-default"
                  checked={newAddress.is_default}
                  onCheckedChange={(checked) => setNewAddress({ ...newAddress, is_default: checked })}
                />
                <Label htmlFor="new-default" className="text-sm">
                  Set as default address
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingNew(false)} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleAddAddress} disabled={saving}>
                {saving ? "Adding..." : "Add Address"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <Card className="border-slate-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="h-12 w-12 text-slate-400 mb-4" />
            <p className="text-slate-600 text-center">No addresses found</p>
            <p className="text-slate-500 text-sm text-center mt-1">Add your first delivery address</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {addresses.map((address) => (
            <Card key={address.id} className="border-slate-200 hover:shadow-sm transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <CardTitle className="text-lg font-medium text-slate-900 truncate">{address.name}</CardTitle>
                    {address.is_default && (
                      <Badge variant="secondary" className="mt-1 bg-slate-100 text-slate-700 w-fit">
                        Default
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="border-slate-200 bg-transparent">
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAddress(address.id!)}
                      className="border-slate-200 text-red-600 hover:text-red-700 hover:border-red-200"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm text-slate-600">
                  <p>
                    {address.line1}
                    {address.line2 && `, ${address.line2}`}
                  </p>
                  <p>
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  <p>{address.country}</p>
                  <div className="flex flex-col gap-2 pt-2 text-slate-500 sm:flex-row sm:items-center sm:gap-4">
                    <span className="truncate">{address.phone}</span>
                    <span className="truncate">{address.email}</span>
                  </div>
                </div>
                {!address.is_default && (
                  <div className="mt-4 pt-3 border-t border-slate-200">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address.id!)}
                      className="border-slate-200"
                    >
                      Set as Default
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
