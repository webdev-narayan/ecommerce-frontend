'use client'

import { LoadingShoppingCart } from "./loaders"

export default function FullscreenLoader() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur">
            {/* <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid" /> */}
            <LoadingShoppingCart />
        </div>
    )
}
