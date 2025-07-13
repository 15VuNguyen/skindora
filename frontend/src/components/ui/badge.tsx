import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-accent text-accent-foreground [a&]:hover:bg-accent/90",
        complete: " bg-emerald-100 text-emerald-800 border-emerald-200 [a&]:hover:bg-green-100",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        danger: "border-transparent bg-red-500 text-white [a&]:hover:bg-red-600",

        pending: "bg-amber-500 text-white hover:bg-amber-600 cursor-pointer",
        confirmed: "bg-green-600 text-white hover:bg-green-700",

        processing: "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer",
        delievered: "bg-emerald-500 text-white hover:bg-emerald-600 cursor-pointer",
        shipping: "bg-cyan-500 text-white hover:bg-cyan-600 cursor-pointer",
        waiting: "border-transparent bg-yellow-100 text-yellow-800 [a&]:hover:bg-yellow-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
