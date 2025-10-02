import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary" | "destructive";
  size?: "sm" | "md" | "lg";
}

const variantClasses = {
  default:
    "bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] hover:brightness-95",
  primary:
    "bg-[var(--primary)] text-[var(--primary-foreground)] hover:brightness-90",
  secondary:
    "bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:brightness-90",
  destructive:
    "bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:brightness-90",
};

const sizeClasses = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-md",
  lg: "px-6 py-3 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "rounded-md font-medium transition-all duration-150",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
