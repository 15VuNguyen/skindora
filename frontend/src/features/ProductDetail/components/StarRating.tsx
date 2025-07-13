import { Star } from "lucide-react";
import React from "react";

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  size?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating = 0, totalStars = 5, size = 16 }) => {
  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        
        const starClass =
          starValue <= rating
            ? "fill-current text-yellow-400" 
            : "fill-current text-gray-300"; 

        return <Star key={index} size={size} className={starClass} />;
      })}
    </div>
  );
};