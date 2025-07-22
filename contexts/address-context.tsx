"use client"

import { Address } from "@/types/address"
import { createContext, useContext, useState, type ReactNode } from "react"


interface AddressContextType {
  addresses: Address[]
  selectedAddress: number
  setSelectedAddress: (id: number) => void
  addAddress: (address: Address) => void
  removeAddress: (id: number) => void
  updateAddress: (id: number, updatedAddress: Partial<Address>) => void
}

const AddressContext = createContext<AddressContextType | null>(null)

const defaultAddresses: Address[] = [
  {
    id: 1,
    name: "Home",
    email: "home@gmail.com",
    line1: "123 Main Street, Apartment 4B",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    pincode: "400001",
    phone: "+91 9876543210",
    is_default: true,
  },
  {
    id: 2,
    name: "Office",
    email: "home@gmail.com",
    line1: "123 Main Street, Apartment 4B",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    pincode: "400001",
    phone: "+91 9876543210",
    is_default: true,
  },
]

interface AddressProviderProps {
  children: ReactNode
}

export function AddressProvider({ children }: AddressProviderProps) {
  const [addresses, setAddresses] = useState<Address[]>(defaultAddresses)
  const [selectedAddress, setSelectedAddress] = useState<number>(1)

  const addAddress = (address: Address) => {
    setAddresses((prev) => [...prev, address])
  }

  const removeAddress = (id: number) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id))
  }

  const updateAddress = (id: number, updatedAddress: Partial<Address>) => {
    setAddresses((prev) => prev.map((addr) => (addr.id === id ? { ...addr, ...updatedAddress } : addr)))
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
