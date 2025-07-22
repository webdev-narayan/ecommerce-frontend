"use client"

import { useState } from "react"

export interface Address {
  id: number; // Optional, added by Strapi
  name: string;
  phone: string;
  email: string;
  line1: string;
  line2?: string; // Optional field
  city: string;
  state: string;
  pincode: string;
  country: string;
  is_default: boolean;
}

const defaultAddresses: Address[] = [
  {
    id: 1,
    name: "Home",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    phone: "+91 9876543210",
    is_default: true,
    email: "john.doe@example.com",
    line1: "123 Main St",
    country: "India",
  },
  {
    id: 2,
    name: "Raipur",
    city: "Raipur",
    state: "Chhattisgarh",
    pincode: "492001",
    phone: "+91 9876543210",
    is_default: false,
    email: "john.doe@example.com",
    line1: "123 Main St",
    country: "India",
  },
]

export function useAddress() {
  const [addresses, setAddresses] = useState<Address[]>(defaultAddresses)
  const [selectedAddress, setSelectedAddress] = useState<string>("1")

  const addAddress = (address: Address) => {
    setAddresses((prev) => [...prev, address])
  }

  const removeAddress = (id: number) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id))
  }

  const updateAddress = (id: number, updatedAddress: Partial<Address>) => {
    setAddresses((prev) => prev.map((addr) => (addr.id === id ? { ...addr, ...updatedAddress } : addr)))
  }

  return {
    addresses,
    selectedAddress,
    setSelectedAddress,
    addAddress,
    removeAddress,
    updateAddress,
  }
}
