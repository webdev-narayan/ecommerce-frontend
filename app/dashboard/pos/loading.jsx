import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function POSLoading() {
  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Panel - Products */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b p-4">
          <Skeleton className="h-8 w-48 mb-4" />

          {/* Search and Filters */}
          <div className="flex gap-4">
            <Skeleton className="flex-1 h-10" />
            <Skeleton className="w-48 h-10" />
            <Skeleton className="w-10 h-10" />
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 15 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-3">
                  <Skeleton className="w-full h-20 rounded mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-5 w-16 mb-1" />
                  <Skeleton className="h-3 w-12" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Cart */}
      <div className="w-96 bg-white border-l flex flex-col">
        {/* Cart Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-8" />
          </div>

          {/* Customer Selection */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <div className="flex gap-2">
              <Skeleton className="flex-1 h-10" />
              <Skeleton className="w-10 h-10" />
            </div>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-auto p-4">
          <div className="text-center text-gray-500 mt-8">
            <Skeleton className="mx-auto h-12 w-12 mb-4" />
            <Skeleton className="h-4 w-24 mx-auto mb-2" />
            <Skeleton className="h-3 w-32 mx-auto" />
          </div>
        </div>

        {/* Cart Summary */}
        <div className="border-t p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="w-20 h-8" />
          </div>

          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>

          <Skeleton className="h-16 w-full" />
          <Skeleton className="w-full h-12" />
        </div>
      </div>
    </div>
  )
}
