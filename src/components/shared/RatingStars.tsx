import React from "react";
import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: number;
  className?: string;
}

export function RatingStars({
  rating,
  reviewCount,
  size = 13,
  className,
}: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0 && rating % 1 >= 0.3;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center space-x-1.5", className)}>
      <div className="flex items-center text-primary">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            className="fill-current"
            style={{ width: size, height: size }}
          />
        ))}

        {hasHalfStar && (
          <div className="relative inline-block text-primary">
            <StarHalf
              className="fill-current"
              style={{ width: size, height: size }}
            />
          </div>
        )}

        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            className="text-border"
            style={{ width: size, height: size }}
          />
        ))}
      </div>

      {reviewCount !== undefined && (
        <span className="font-mono text-[10px] text-text-secondary tracking-tight">
          ({reviewCount} reviews)
        </span>
      )}
    </div>
  );
}
