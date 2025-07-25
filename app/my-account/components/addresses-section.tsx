"use client"

import { useState, useEffect } from "react"
import { Plus, Edit3, MapPin, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { deleteApi, getApi, postApi, putApi } from "@/lib/api"
import { Address, CreateAddress } from "@/lib/types/address"
import { useAuth } from "@/contexts/auth-context"
import AddressForm from "./address-form"

const INITIAL_VALUE = {
  documentId: "",
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
}

export function AddressesSection() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [openForm, setOpenForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  // const { addAddress, addresses, updateAddress, removeAddress } = useAddress()

  const [addressFormData, setAddressFormData] = useState<CreateAddress>(INITIAL_VALUE)

  const fetchAddresses = async () => {
    setLoading(true)
    if (!user) return
    const query = new URLSearchParams()
    query.append("filters[user][id][$eq]", user?.id.toString())
    const res = await getApi<{ data: Address[] }>(`/addresses?${query.toString()}`, true)
    setAddresses(res.data?.data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    fetchAddresses()
  }, [user])

  const handleSubmit = async () => {
    if (!user) return
    if (isEditing) {
      const payload: any = { ...addressFormData };
      delete payload.documentId;
      const res = await putApi<{ data: Address }>(`/addresses/${addressFormData.documentId}`, payload, true)
      if (res.data?.data) setAddresses([...addresses.filter(item => item.documentId !== addressFormData.documentId), res.data?.data].map(item => ({ ...item, is_default: item.documentId === addressFormData.documentId })))
      setIsEditing(false)
    } else {
      const res = await postApi<{ data: Address }>("/addresses", { ...addressFormData, user: user.id }, true)
      if (res.data?.data) setAddresses([...addresses, res.data?.data])
    }
    setOpenForm(false)
  }

  const handleDelete = async (documentId: string) => {
    if (!user) return
    const res = await deleteApi(`/addresses/${documentId}`)
    if (res.success) setAddresses(addresses.filter((address) => address.documentId !== documentId));
  }


  const handleEditClick = async ({ id, user, createdAt, updatedAt, ...rest }: Address) => {
    console.log(rest)
    setIsEditing(true)
    setAddressFormData(rest)
    setOpenForm(true)
  }

  const handleSetDefault = async (documentId: string) => {
    const res = await putApi<{ data: Address }>(`/addresses/${documentId}`, { is_default: true }, true)
    if (res.data?.data) {
      setAddresses(addresses.map((address) => {
        if (address.documentId === documentId) {
          return { ...address, is_default: true }
        }
        return { ...address, is_default: false }
      }))
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
        <AddressForm
          addressFormData={addressFormData}
          handleSubmit={handleSubmit}
          open={openForm}
          setAddressFormData={setAddressFormData}
          setOpenForm={setOpenForm}
          isEditing={isEditing}
        />
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

                    {!address.is_default && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(address.documentId!)}
                        className="border-slate-200"
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button
                      onClick={() => handleEditClick(address)}
                      variant="outline"
                      size="sm"
                      className="border-slate-200 bg-transparent">
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(address.documentId)}
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
