import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProductSkeleton() {
    return (
        <Card className="overflow-hidden">
            <CardContent className="p-0">
                <Skeleton className="w-full h-64" />
                <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                    </div>
                    <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-4 w-4" />
                        ))}
                        <Skeleton className="h-4 w-8 ml-2" />
                    </div>
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-9 w-16" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export function FilterSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-4" />
            </div>

            <div className="space-y-3">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-3">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-12" />
                </div>
            </div>

            {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-3">
                    <Skeleton className="h-5 w-20" />
                    <div className="space-y-2">
                        {[...Array(4)].map((_, j) => (
                            <div key={j} className="flex items-center space-x-2">
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
