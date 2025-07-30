import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>

      <Skeleton className="h-10 w-96" />

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="p-6 pt-0">
          <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
            <div className="flex gap-4">
              <Skeleton className="h-10 w-[300px]" />
              <Skeleton className="h-10 w-24" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>

          <div className="rounded-md border">
            <div className="h-10 border-b px-4 flex items-center">
              <div className="grid grid-cols-7 w-full">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16 ml-auto" />
              </div>
            </div>
            <div className="divide-y">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="px-4 py-4">
                    <div className="grid grid-cols-7 w-full items-center">
                      <Skeleton className="h-4 w-4" />
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-10 w-16 rounded" />
                        <div>
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-3 w-24 mt-1" />
                        </div>
                      </div>
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <Skeleton className="h-4 w-48" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
