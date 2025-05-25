import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import React from "react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type HeadingAsProps = {
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "p";
};
const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "heading-1",
      h2: "heading-2",
      // h2: tw`text-4xl font-semibold leading-9 md:(text-2xl leading-[30px])`,
      // h3: tw`text-3xl font-semibold leading-9 md:text-2xl xs:(text-base leading-6)`,
      h4: "heading-4",
      h5: "heading-5",
      h6: "heading-6",
      subtitle1: "heading-subtitle1",
      // subtitle2: tw`text-sm font-bold leading-4.5`,
      body1: "heading-body1",
      body2: "heading-body2",
      // button: tw`text-sm font-semibold leading-4`,
      // button2: tw`text-xs font-semibold leading-4`,
      // caption: tw`text-xs font-normal leading-3.5`,
      overline: "heading-overline",
      inherit: "heading-inherit",
    },
  },
  defaultVariants: {
    variant: "inherit",
  },
});
type VariantType = "h1" | "h2" | "h4" | "h5" | "h6" | "subtitle1" | "body1" | "body2" | "inherit" | "overline";

interface ITypography
  extends HeadingAsProps,
    Omit<React.HTMLAttributes<HTMLElement>, "ref">,
    VariantProps<typeof typographyVariants> {
  align?: string;
  children?: ReactNode;
  className?: string;
  variant?: VariantType;
}
const variantsMapping = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  subtitle1: "h6",
  subtitle2: "h6",
  body1: "p",
  body2: "p",
  inherit: "p",
  overline: "span",
};

function Typography({ align, children, className, tag, variant, ...others }: ITypography) {
  const Component: React.ElementType = (tag || (variant && variantsMapping[variant]) || "span") as React.ElementType;

  return (
    <Component className={cn(typographyVariants({ variant }), className)} {...others}>
      {children}
    </Component>
  );
}

export default Typography;
