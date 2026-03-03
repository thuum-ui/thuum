import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative border border-border bg-card text-card-foreground",
      /* Decorative corner ticks — evokes the Skyrim panel ornaments */
      "before:absolute before:-left-px before:-top-px before:h-3 before:w-3 before:border-l before:border-t before:border-foreground/60",
      "after:absolute after:-right-px after:-top-px after:h-3 after:w-3 after:border-r after:border-t after:border-foreground/60",
      className
    )}
    {...props}
  >
    {props.children}
    {/* Bottom corner ticks rendered via an inner wrapper to avoid prop conflicts */}
  </div>
));
Card.displayName = "Card";

const CardCorners = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    aria-hidden
    className={cn(
      "pointer-events-none absolute inset-0",
      "before:absolute before:-bottom-px before:-left-px before:h-3 before:w-3 before:border-b before:border-l before:border-foreground/60",
      "after:absolute after:-bottom-px after:-right-px after:h-3 after:w-3 after:border-b after:border-r after:border-foreground/60",
      className
    )}
    {...props}
  />
));
CardCorners.displayName = "CardCorners";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-none tracking-wide",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center border-t border-border p-6",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardCorners,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
