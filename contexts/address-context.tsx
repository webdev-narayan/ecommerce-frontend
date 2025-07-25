"use client"

import { getApi, postApi } from "@/lib/api"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useAuth } from "./auth-context"
import { Address, CreateAddress } from "@/lib/types/address"


interface AddressContextType {
  addresses: Address[]
  selectedAddress: string
  setSelectedAddress: (id: string) => void
  addAddress: (address: CreateAddress) => Promise<void>
  removeAddress: (id: string) => void
  updateAddress: (id: string, updatedAddress: Partial<Address>) => void
}

const AddressContext = createContext<AddressContextType | null>(null)

interface AddressProviderProps {
  children: ReactNode
}

export function AddressProvider({ children }: AddressProviderProps) {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string>("1")
  const { user } = useAuth();
  async function fetchAddresses() {
    if (!user) return;
    const res = await getApi<{ data: Address[] }>(`/addresses?filters[user][id][$eq]=${user.id}`, true)
    if (res.data) {
      setAddresses(res.data.data)
      const defaultAddress = res.data.data.find((addr) => addr.is_default)
      if (defaultAddress) {
        setSelectedAddress(defaultAddress?.id?.toString())
      } else {
        setSelectedAddress(res.data.data[0]?.id.toString())
      }
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [user])

  const addAddress = async ({ documentId, ...rest }: CreateAddress) => {
    const res = await postApi<{ data: Address }>("/addresses", rest, true)
    if (res.data?.data) {
      setAddresses((prev) => [...prev, res.data?.data as Address])
      setSelectedAddress(res.data.data.id.toString())
    }
  }

  const removeAddress = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id?.toString() !== id))
  }

  const updateAddress = (id: string, updatedAddress: Partial<Address>) => {
    setAddresses((prev) => prev.map((addr) => (addr.id?.toString() === id ? { ...addr, ...updatedAddress } : addr)))
  }

  return (
    <AddressContext.Provider
      value={{
        addresses,
        selectedAddress,
        setSelectedAddress,
        addAddress,
        removeAddress,
        updateAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  )
}

export function useAddress(): AddressContextType {
  const context = useContext(AddressContext)
  if (!context) {
    throw new Error("useAddress must be used within an AddressProvider")
  }
  return context
}
