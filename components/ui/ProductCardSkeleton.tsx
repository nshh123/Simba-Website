import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function ProductCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden h-full pt-0 gap-0">
      <div className="relative aspect-square w-full bg-muted animate-pulse" />
      <CardHeader className="p-4 flex-none">
        <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1 flex flex-col justify-between">
        <div className="space-y-2 mb-2">
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
        </div>
        <div className="h-6 w-1/3 bg-muted animate-pulse rounded mt-4" />
      </CardContent>
      <div className="px-4 pb-4 pt-0">
        <div className="h-10 w-full bg-muted animate-pulse rounded" />
      </div>
    </Card>
  );
}
