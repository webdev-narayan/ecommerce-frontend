"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface PaymentGateway {
  id: string
  name: string
  icon: string
  processingFee: number
}

interface PaymentContextType {
  paymentGateways: PaymentGateway[]
  selectedPaymentGateway: PaymentGateway | null
  setSelectedPaymentGateway: (gateway: PaymentGateway) => void
}

const PaymentContext = createContext<PaymentContextType | null>(null)

const defaultPaymentGateways: PaymentGateway[] = [
  { id: "PREPAID", name: "Razorpay", icon: "💳", processingFee: 0 },
  { id: "COD", name: "COD", icon: "🪙", processingFee: 0 },
]

interface PaymentProviderProps {
  children: ReactNode
}

export function PaymentProvider({ children }: PaymentProviderProps) {
  const [paymentGateways] = useState<PaymentGateway[]>(defaultPaymentGateways)
  const [selectedPaymentGateway, setSelectedPaymentGateway] = useState<PaymentGateway>(paymentGateways[0])

  return (
    <PaymentContext.Provider
      value={{
        paymentGateways,
        selectedPaymentGateway,
        setSelectedPaymentGateway,
      }}
    >
      {children}
    </PaymentContext.Provider>
  )
}

export function usePayment(): PaymentContextType {
  const context = useContext(PaymentContext)
  if (!context) {
    throw new Error("usePayment must be used within a PaymentProvider")
  }
  return context
}
