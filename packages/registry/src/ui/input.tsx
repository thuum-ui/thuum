import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full border border-border bg-input px-3 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus-visible:border-foreground/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-30",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
