import { Product } from '@/app/dashboard/products/product.type'
import { Dialog, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { DialogContent, DialogTitle } from '@radix-ui/react-dialog'
import React from 'react'

const ReviewModal = ({ product, open, setOpen }: {
    product: Product,
    open: boolean,
    setOpen: any
}) => {
    return (
        <Dialog open={open} onOpenChange={setOpen} key={product.id}>
            <DialogTrigger className='hidden'>

            </DialogTrigger>
            <DialogContent>
                <DialogTitle>
                    Write a Product Review
                </DialogTitle>
            </DialogContent>
        </Dialog>
    )
}

export default ReviewModal