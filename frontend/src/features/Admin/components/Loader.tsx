import { type VariantProps, cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const loaderVariants = cva(
  // Các class cơ bản: màu sắc và hiệu ứng quay
  "text-primary animate-spin",
  {
    variants: {
      // Các biến thể về kích thước
      size: {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-10 w-10",
      },
    },
    defaultVariants: {
      size: "md", // Kích thước mặc định
    },
  }
);

interface LoaderProps extends VariantProps<typeof loaderVariants> {}

export const Loader = ({ size }: LoaderProps) => {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className={cn(loaderVariants({ size }))} />
    </div>
  );
};
