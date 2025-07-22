"use client"

import { CreditCard } from "lucide-react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { usePayment } from "@/contexts/payment-context"

export function PaymentSelection() {
    const { paymentGateways, selectedPaymentGateway, setSelectedPaymentGateway } = usePayment()

    return (
        <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Method
            </h3>

            <RadioGroup
                value={selectedPaymentGateway?.id}
                onValueChange={(value) => {
                    const gateway = paymentGateways.find((g) => g.id === value)
                    if (gateway) setSelectedPaymentGateway(gateway)
                }}
            >
                <div className="flex items-center gap-x-4">
                    {paymentGateways.map((gateway) => (
                        <div key={gateway.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                            <RadioGroupItem value={gateway.id} id={gateway.id} />
                            <Label htmlFor={gateway.id} className="flex items-center gap-2 cursor-pointer flex-1">
                                <span className="text-lg">{gateway.icon}</span>
                                <div>
                                    <div className="font-medium text-sm">{gateway.name}</div>
                                    {gateway.processingFee > 0 && (
                                        <div className="text-xs text-gray-500">+₹{gateway.processingFee} fee</div>
                                    )}
                                </div>
                            </Label>
                        </div>
                    ))}
                </div>
            </RadioGroup>
        </div>
    )
}
