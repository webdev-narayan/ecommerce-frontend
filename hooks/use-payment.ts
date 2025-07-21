"use client"

import { useState } from "react"

interface PaymentGateway {
  id: string
  name: string
  icon: string
  processingFee: number
}

const defaultPaymentGateways: PaymentGateway[] = [
  { id: "razorpay", name: "Razorpay", icon: "💳", processingFee: 0 },
  { id: "cod", name: "Cash On Delivery", icon: "🪙", processingFee: 0 },

]

export function usePayment() {
  const [paymentGateways] = useState<PaymentGateway[]>(defaultPaymentGateways)
  const [selectedPaymentGateway, setSelectedPaymentGateway] = useState<PaymentGateway>(paymentGateways[0])

  return {
    paymentGateways,
    selectedPaymentGateway,
    setSelectedPaymentGateway,
  }
}
