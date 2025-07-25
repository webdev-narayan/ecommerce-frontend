import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { CreateAddress } from '@/lib/types/address'
import { Plus } from 'lucide-react'
import React from 'react'

interface AddressFormProps {
    open: boolean
    addressFormData: CreateAddress
    isEditing: boolean
    setOpenForm: (value: boolean) => void
    setAddressFormData: (formData: CreateAddress) => void
    handleSubmit: () => void
}

const AddressForm = ({ open, addressFormData, isEditing, setAddressFormData, setOpenForm, handleSubmit }: AddressFormProps) => {


    return (
        <Dialog open={open} onOpenChange={setOpenForm}>
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
                        <Label htmlFor="name" className="text-sm font-medium">
                            Full Name
                        </Label>
                        <Input
                            id="name"
                            value={addressFormData.name || ""}
                            onChange={(e) => setAddressFormData({ ...addressFormData, name: e.target.value })}
                            className="border-slate-200"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium">
                            Phone
                        </Label>
                        <Input
                            id="phone"
                            value={addressFormData.phone || ""}
                            onChange={(e) => setAddressFormData({ ...addressFormData, phone: e.target.value })}
                            className="border-slate-200"
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={addressFormData.email || ""}
                            onChange={(e) => setAddressFormData({ ...addressFormData, email: e.target.value })}
                            className="border-slate-200"
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="line1" className="text-sm font-medium">
                            Address Line 1
                        </Label>
                        <Input
                            id="line1"
                            value={addressFormData.line1 || ""}
                            onChange={(e) => setAddressFormData({ ...addressFormData, line1: e.target.value })}
                            className="border-slate-200"
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="line2" className="text-sm font-medium">
                            Address Line 2 (Optional)
                        </Label>
                        <Input
                            id="line2"
                            value={addressFormData.line2 || ""}
                            onChange={(e) => setAddressFormData({ ...addressFormData, line2: e.target.value })}
                            className="border-slate-200"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-medium">
                            City
                        </Label>
                        <Input
                            id="city"
                            value={addressFormData.city || ""}
                            onChange={(e) => setAddressFormData({ ...addressFormData, city: e.target.value })}
                            className="border-slate-200"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="state" className="text-sm font-medium">
                            State
                        </Label>
                        <Input
                            id="state"
                            value={addressFormData.state || ""}
                            onChange={(e) => setAddressFormData({ ...addressFormData, state: e.target.value })}
                            className="border-slate-200"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pincode" className="text-sm font-medium">
                            Pincode
                        </Label>
                        <Input
                            id="pincode"
                            value={addressFormData.pincode || ""}
                            onChange={(e) => setAddressFormData({ ...addressFormData, pincode: e.target.value })}
                            className="border-slate-200"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="country" className="text-sm font-medium">
                            Country
                        </Label>
                        <Input
                            id="country"
                            value={addressFormData.country || ""}
                            onChange={(e) => setAddressFormData({ ...addressFormData, country: e.target.value })}
                            className="border-slate-200"
                        />
                    </div>
                    <div className="flex items-center space-x-2 md:col-span-2">
                        <Switch
                            id="default"
                            checked={addressFormData.is_default}
                            onCheckedChange={(checked) => setAddressFormData({ ...addressFormData, is_default: checked })}
                        />
                        <Label htmlFor="default" className="text-sm">
                            Set as default address
                        </Label>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenForm(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                        {isEditing ? "Save" : "Add"} Address
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddressForm