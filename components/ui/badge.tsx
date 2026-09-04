import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-blue-600/10 text-blue-700 dark:bg-blue-400/15 dark:text-blue-300",
        word: "border-transparent bg-blue-600/10 text-blue-700 dark:bg-blue-400/15 dark:text-blue-300",
        excel:
          "border-transparent bg-emerald-600/10 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
        ppt: "border-transparent bg-orange-600/10 text-orange-700 dark:bg-orange-400/15 dark:text-orange-300",
        outline: "text-foreground",
        secondary:
          "border-transparent bg-white/60 text-foreground dark:bg-white/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
