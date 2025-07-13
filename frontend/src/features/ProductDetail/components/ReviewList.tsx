import { AlertTriangle, LoaderCircle, Star } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useProductReviewsQuery } from "@/hooks/queries/useProductReviewsQuery";
import type { Review } from "@/types";

interface ReviewListProps {
  productId: string;
}

export function ReviewList({ productId }: ReviewListProps) {
  const { data: paginatedReviews, isLoading, isError, error } = useProductReviewsQuery(productId);

  const reviews = paginatedReviews?.data || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <LoaderCircle className="text-primary h-10 w-10 animate-spin" />
        <p className="text-muted-foreground mt-2">Đang tải đánh giá...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="border-destructive/50 bg-destructive/10 flex flex-col items-center justify-center rounded-lg border py-12 text-center">
        <AlertTriangle className="text-destructive h-10 w-10" />
        <p className="text-destructive mt-2 font-semibold">Không thể tải đánh giá</p>
        <p className="text-muted-foreground mt-1 text-sm">{error.message}</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!</p>
      </div>
    );
  }

  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum: number, review: Review) => sum + review.rating, 0) / reviews.length : 0;

  return (
    <div className="space-y-6">
      <div className="bg-muted/30 flex items-center gap-4 rounded-lg p-4">
        <div className="text-center">
          <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
          <div className="flex items-center justify-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <div className="text-muted-foreground text-sm">{reviews.length} đánh giá</div>
        </div>

        <div className="flex-1 space-y-1">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = reviews.filter((r: Review) => r.rating === rating).length;
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={rating} className="flex items-center gap-2 text-sm">
                <span className="w-3">{rating}</span>
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <div className="h-2 flex-1 rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-yellow-400" style={{ width: `${percentage}%` }} />
                </div>
                <span className="text-muted-foreground w-8">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review: Review) => (
          <div key={review._id} className="border-b pb-4 last:border-b-0">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-medium">Người dùng xác thực</span>
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground text-sm">{formatDate(review.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-700">{review.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
