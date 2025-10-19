"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  value: number
  max?: number
  label?: string
}

function Progress({ className, value = 0, max = 20, label, ...props }: ProgressProps) {
  const percentage = Math.min((value / max) * 100, 100)

  return (
      <div className="w-full">
        <div className="flex justify-between mb-1 text-sm font-medium text-gray-700">
          <span>{label || "Осталось звезд"}</span>
          <span>{value}/{max}</span>
        </div>
        <ProgressPrimitive.Root
            className={cn(
                "relative h-4 w-full overflow-hidden rounded-xl bg-gray-200",
                className
            )}
            {...props}
        >
          <ProgressPrimitive.Indicator
              className="h-full transition-all rounded-xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600"
              style={{ transform: `translateX(-${100 - percentage}%)` }}
          />
        </ProgressPrimitive.Root>
      </div>
  )
}

export { Progress }
