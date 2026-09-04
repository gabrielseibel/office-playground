"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, onChange, ...props }, ref) => {
    return (
      <label
        className={cn(
          "relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2",
          checked ? "bg-blue-600" : "bg-gray-300 dark:bg-white/20",
          className
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => {
            onChange?.(e);
            onCheckedChange?.(e.target.checked);
          }}
          {...props}
        />
        <span
          aria-hidden
          className={cn(
            "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </label>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };
