import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function BrandsLoading() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-10 w-[150px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <Skeleton className="h-10 w-full md:w-64" />
        <Skeleton className="h-10 w-[200px]" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array(8)
          .fill(null)
          .map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-[120px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="flex justify-center mb-4">
                  <Skeleton className="h-24 w-24 rounded-md" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-[80px]" />
                  <Skeleton className="h-4 w-[70px]" />
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Skeleton className="h-9 w-[60px]" />
                <Skeleton className="h-9 w-[70px]" />
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  )
}
