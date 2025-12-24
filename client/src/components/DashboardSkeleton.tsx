import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="border-b bg-card">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="h-10 w-64 bg-muted rounded-lg animate-pulse" />
              <div className="h-6 w-96 bg-muted rounded-lg animate-pulse" />
            </div>
            <div className="h-11 w-48 bg-muted rounded-lg animate-pulse" />
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                <div className="h-10 w-10 bg-muted rounded-lg animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-9 w-16 bg-muted rounded animate-pulse mb-2" />
                <div className="h-3 w-32 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart Skeleton */}
        <Card className="mb-8">
          <CardHeader>
            <div className="h-6 w-48 bg-muted rounded animate-pulse mb-2" />
            <div className="h-4 w-96 bg-muted rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-muted rounded-lg animate-pulse" />
          </CardContent>
        </Card>

        {/* Two Column Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 w-40 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="p-4 border rounded-lg">
                      <div className="h-5 w-48 bg-muted rounded animate-pulse mb-2" />
                      <div className="h-4 w-64 bg-muted rounded animate-pulse mb-3" />
                      <div className="flex gap-4">
                        <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                        <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                        <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
