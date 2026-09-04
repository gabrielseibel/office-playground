"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:brightness-110",
        word: "bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-700/30 hover:shadow-blue-700/40 hover:brightness-110",
        excel:
          "bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-lg shadow-green-700/30 hover:shadow-green-700/40 hover:brightness-110",
        ppt: "bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg shadow-orange-600/30 hover:shadow-orange-600/40 hover:brightness-110",
        outline:
          "border border-white/20 bg-white/40 text-foreground backdrop-blur-md hover:bg-white/60 dark:bg-white/5 dark:hover:bg-white/10",
        ghost:
          "text-foreground/80 hover:bg-white/40 hover:text-foreground dark:hover:bg-white/5",
        secondary:
          "bg-white/70 text-foreground backdrop-blur-md border border-black/5 hover:bg-white dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 px-3",
        lg: "h-14 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
