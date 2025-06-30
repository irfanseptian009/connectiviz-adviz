import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-500/50 hover:-translate-y-0.5 active:translate-y-0 btn-futuristic",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 hover:from-red-600 hover:to-red-700 hover:shadow-red-500/50 hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-red-500/20 dark:focus-visible:ring-red-500/40",
        outline:
          "border-2 border-orange-300/60 bg-gradient-to-r from-orange-50/80 via-white/60 to-orange-100/80 text-orange-700 shadow-sm hover:bg-gradient-to-r hover:from-orange-100 hover:to-orange-200 hover:text-orange-800 hover:border-orange-400/80 hover:-translate-y-0.5 dark:border-orange-400/40 dark:from-slate-800/60 dark:via-orange-900/20 dark:to-slate-800/60 dark:text-orange-300 dark:hover:from-orange-900/40 dark:hover:to-orange-800/40 dark:hover:text-orange-200",
        secondary:
          "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 shadow-sm hover:from-orange-200 hover:to-orange-300 hover:-translate-y-0.5 dark:from-orange-900/30 dark:to-orange-800/30 dark:text-orange-200 dark:hover:from-orange-800/40 dark:hover:to-orange-700/40",
        ghost:
          "text-orange-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 hover:text-orange-800 dark:text-orange-300 dark:hover:from-orange-900/20 dark:hover:to-orange-800/20 dark:hover:text-orange-200",
        link: "text-orange-600 underline-offset-4 hover:underline hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300",
      },
      size: {
        default: "h-10 px-6 py-3 has-[>svg]:px-4",
        sm: "h-8 rounded-md gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-12 rounded-lg px-8 has-[>svg]:px-6 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
