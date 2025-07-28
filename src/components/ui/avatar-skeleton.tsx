import { cn } from "@/lib/utils";

interface AvatarSkeletonProps {
  className?: string;
  size?: number;
}

export function AvatarSkeleton({ className, size = 32 }: AvatarSkeletonProps) {
  return (
    <div
      className={cn("bg-muted rounded-full animate-pulse", className)}
      style={{
        width: size,
        height: size,
      }}
    />
  );
}
