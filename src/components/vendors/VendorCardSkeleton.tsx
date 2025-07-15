import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

const VendorCardSkeleton: React.FC = () => {
  return (
    <Card className="overflow-hidden border-wedding-olive/20">
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          <Skeleton className="w-full h-full rounded-none" />
        </AspectRatio>
        <div className="absolute top-3 left-3">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="absolute top-3 right-3">
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>

      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <div className="flex items-center">
          <Skeleton className="h-4 w-4 mr-1 rounded" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="mt-2 flex items-center">
          <Skeleton className="h-4 w-4 mr-1 rounded" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </CardContent>

      <CardFooter className="px-4 pb-4 pt-0">
        <Skeleton className="h-9 w-full rounded-md" />
      </CardFooter>
    </Card>
  );
};

export default VendorCardSkeleton;