
import * as React from "react"
import { cn } from "@/lib/utils"

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "strong" | "subtle"
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-white/10 backdrop-blur-md border border-white/20",
      strong: "bg-white/20 backdrop-blur-lg border border-white/30", 
      subtle: "bg-white/5 backdrop-blur-sm border border-white/10"
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl shadow-lg shadow-black/5",
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)
GlassCard.displayName = "GlassCard"

export { GlassCard }
